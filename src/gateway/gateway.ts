// deno-lint-ignore-file no-explicit-any
//gateway.ts
import { DiscordEvents } from "../constants.ts";
import { closeCodes, OpCodes } from "../structures/gateway.ts";
import type { GatewayIntents, GatewayPayload, Identify } from "../structures/gateway.ts";
import { ActivityType } from "../structures/activities.ts";

export class Gateway {
    private botIdentificationName = "@cross/Discordbot";
    private socket: WebSocket;
    private heartbeatInterval: number | null = null;
    private token: string;
    private intents: GatewayIntents[];

    // reconnect configs
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private baseRetryDelay = 1000;

    private lastSequenceNumber: number | null = null;
    private resumeGatewayUrl: string | null = null;
    private sessionId: string | null = null;

    constructor(token: string, intents: GatewayIntents[], gatewayURL: string) {
        this.socket = new WebSocket(gatewayURL);

        this.token = token;
        this.intents = intents;

        this.socket.onopen = () => this.handleOpen();
        this.socket.onmessage = (ev) => this.handleMessage(ev.data);
        this.socket.onerror = (ev) => this.handleError(ev);
        this.socket.onclose = (ev) => this.handleClose(ev);
    }

    private listeners: { [event: string]: ((...args: any[]) => void)[] } = {};

    on(event: DiscordEvents, callback: (...args: any[]) => void) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
    }

    private emit(event: DiscordEvents, ...args: any[]) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => listener(...args));
        }
    }

    private handleOpen() {
        console.log("WebSocket connection established");
        this.sendIdentify(this.token, this.intents);
    }

    close(code?: number, reason?: string) {
        if (this.socket) {
            this.socket.close(code, reason);
        }
    }

    private handleMessage(data: string) {
        const payload: GatewayPayload = JSON.parse(data);
        //console.log("EVENT", payload.t, "->", data);
        switch (payload.op) {
            case OpCodes.HELLO:
                this.handleHello(payload.d);
                break;
            case OpCodes.HEARTBEAT_ACK:
                // Might wanna do something
                console.log("Heartbeat ACK")
                break;
            case OpCodes.DISPATCH:
                this.handleGatewayEvents(payload);
                break;
        }
    }

    private handleHello(data: any) {
        const heartbeatIntervalMs = data.heartbeat_interval;
        this.startHeartbeat(heartbeatIntervalMs)
    }

    private sendHeartbeat() {
        const payload = {
            op: OpCodes.HEARTBEAT,
            d: this.lastSequenceNumber,
        };
        this.socket.send(JSON.stringify(payload));        
    }

    private startHeartbeat(intervalMs: number) {
        const jitter = Math.random(); 
        const jitterMs = jitter * intervalMs/2; 
        console.log(`Heartbeat started with intervall ${intervalMs}, initial heartbeat ${jitterMs}.`)
        setTimeout(() => {
            this.heartbeatInterval = setInterval(() => {
                this.sendHeartbeat();
            }, intervalMs);  
          }, jitterMs);
    }

    private handleGatewayEvents(payload: GatewayPayload) {
        if (payload.t === "READY") {
            this.resumeGatewayUrl = payload.d.resume_gateway_url;
            this.sessionId = payload.d.session_id;
        }

        if (Object.values(DiscordEvents).includes(payload.t as DiscordEvents)) {
            console.log("Emit ->", payload.t);
            this.emit(payload.t as DiscordEvents, payload.d);
        } else {
            console.log("Just logging type:", payload.t);
        }

        // Update sequence number
        if (payload.s) {
            this.lastSequenceNumber = payload.s;
        }
    }

    private sendIdentify(token: string, intents: GatewayIntents[]) {
        const identification: Identify = {
            token: token,
            intents: intents.reduce((acc, intent) => acc | intent, 0),
            properties: {
                $os: Deno.build.os,
                $browser: this.botIdentificationName,
                $device: this.botIdentificationName,
            },
            presence: {
                since: Date.now(),
                activities: [{
                    name: "Botting",
                    state: "Doing BOT things",
                    type: ActivityType.CUSTOM,
                }],
                status: "online",
                afk: false,
            },
        };

        const payload = {
            op: OpCodes.IDENTIFY,
            d: identification,
        };

        this.socket.send(JSON.stringify(payload));
    }

    private handleClose(event: CloseEvent) {
        const closeCode = event.code;
        console.error("WebSocket closed. Code:", closeCode, "Reason:", event.reason, "wasClean:", event.wasClean);

        if (this.canResume(closeCode)) {
            this.attemptReconnect();
        } else {
            // Handle non-resumable disconnects
            console.error("Cannot resume, starting a fresh session...");
            // Initiate a new identification process here??
        }
    }

    private canResume(closeCode: number): boolean {
        return closeCodes.some((code) => code.code === closeCode && code.reconnect);
    }

    private attemptReconnect() {
        if (this.resumeGatewayUrl) {
            const newSocket = new WebSocket(this.resumeGatewayUrl);

            newSocket.onopen = () => {
                console.log("Attempting to resume...");
                this.sendResume();
            };

            newSocket.onerror = (error) => {
                this.handleReconnectError(error);
            };

            newSocket.onclose = (event) => {
                this.handleReconnectClose(event);
            };
        } else {
            // todo: throw error
            console.log("No resumeGatewayUrl.");
        }
    }

    private handleReconnectError(ev: Event | ErrorEvent) {
        if (ev instanceof ErrorEvent) {
            console.error("WebSocket Error during reconnect:", ev.message, ev.error);
        } else {
            console.error("WebSocket Event Error during reconnect:", ev.type);
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
        } else {
            // Handle the case where retries are exhausted
        }
    }

    private handleReconnectClose(event: CloseEvent) {
        console.error(
            "Resume attempt closed. Code:",
            event.code,
            "Reason:",
            event.reason,
        );

        if (this.canResume(event.code)) {
            this.scheduleReconnect();
        } else {
            // Handle non-resumable close during resume
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const backoffTime = this.baseRetryDelay * Math.pow(2, this.reconnectAttempts);
            const timeout = backoffTime + Math.random() * backoffTime / 4; // + jitter, according to docs

            setTimeout(() => {
                console.log(`Retrying connection attempt ${this.reconnectAttempts + 1}`);
                this.attemptReconnect();
                this.reconnectAttempts++;
            }, timeout);
        } else {
            console.error(
                "Failed to reconnect after multiple attempts. Please check your connection or bot configuration.",
            );
        }
    }

    private sendResume() {
        const payload: GatewayPayload = {
            op: OpCodes.RESUME,
            d: {
                token: this.token,
                session_id: this.sessionId,
                seq: this.lastSequenceNumber,
            },
        };

        this.socket.send(JSON.stringify(payload));

        this.socket.onmessage = (event) => {
            this.handleResumeResponse(event.data);
        };
    }

    private handleResumeResponse(data: string) {
        const payload = JSON.parse(data);

        if (payload.op === 0 && payload.t === "RESUMED") {
            console.log("Resume successful!");
        } else {
            console.error(
                "Resume failed. Check your session data or Discord's docs.",
            );
            // Potentially trigger a full re-identification process
        }
    }

    private handleError(ev: Event | ErrorEvent) {
        if (ev instanceof ErrorEvent) {
            console.error("WebSocket Error:", ev.message, ev.error);
        } else {
            console.error("WebSocket Event Error:", ev.type);
        }
    }
}
