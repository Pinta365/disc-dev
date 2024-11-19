// gateway.ts

import { closeCodes, OpCodes } from "./structures/gateway.ts";
import type { DiscordEvents, GatewayIntents, GatewayPayload, Identify } from "./structures/gateway.ts";
import { ActivityType } from "./structures/activities.ts";

function debug_getTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

export class Gateway {
    private botIdentificationName = "@pinta365/discordbot"; //Should be configurable
    private socket: WebSocket;
    private heartbeatInterval: number | undefined;
    private token: string;
    private intents: GatewayIntents[];
    private lastSequenceNumber: number | null = null;
    private resumeGatewayUrl: string | undefined = undefined;
    private sessionId: string | undefined = undefined;
    private reconnectCounter = 1;
    private gatewayURL: string;
    private gatewayVersion: number;
    private gatewayEncoding: string;
    private rateLimitBucket: Set<number> = new Set();
    private rateLimitReset: number | null = null;
    private rateLimitRemaining = 120;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;

    constructor(
        token: string,
        intents: GatewayIntents[],
        gatewayURL: string,
        gatewayVersion: number,
        gatewayEncoding: string,
    ) {
        this.token = token;
        this.intents = intents;
        this.gatewayURL = gatewayURL;
        this.gatewayVersion = gatewayVersion;
        this.gatewayEncoding = gatewayEncoding;
        this.socket = new WebSocket(`${gatewayURL}?/v=${gatewayVersion}&encoding=${gatewayEncoding}`);
        this.socket.onopen = () => this.onOpen();
        this.socket.onmessage = (event) => this.onMessage(event);
        this.socket.onclose = (event) => this.onClose(event);
        this.socket.onerror = (event) => this.onError(event);
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

    private onOpen() {
        this.identify();
    }

    private onMessage(event: MessageEvent) {
        const payload: GatewayPayload = JSON.parse(event.data as string);

        if (payload.op !== 11) {
            console.log(debug_getTime(), JSON.stringify(payload), "\n");
        }
        switch (payload.op) {
            case OpCodes.HELLO:
                this.startHeartbeat(payload.d.heartbeat_interval);
                break;
            case OpCodes.DISPATCH:
                this.handleDispatch(payload);
                break;
            case OpCodes.RECONNECT:
                this.resume();
                break;
            case OpCodes.INVALID_SESSION:
                this.handleInvalidSession(payload);
                break;
            case OpCodes.HEARTBEAT_ACK:
                //Don't do anything for now.
                break;
            default:
                console.log(debug_getTime(), payload, "\n");
        }
    }

    private identify() {
        const identification: Identify = {
            token: this.token,
            intents: this.intents.reduce((acc, intent) => acc | intent, 0),
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
        const identifyPayload = {
            op: OpCodes.IDENTIFY,
            d: identification,
        };

        this.send(identifyPayload);
    }

    private startHeartbeat(interval: number) {
        this.heartbeatInterval = setInterval(() => {
            if (this.socket.readyState === WebSocket.OPEN) {
                const heartbeatPayload = {
                    op: OpCodes.HEARTBEAT,
                    d: this.lastSequenceNumber,
                };
                this.send(heartbeatPayload);
            } else {
                console.warn("Heartbeat failed: WebSocket is not open.");
                // attempt reconnection?
            }
        }, interval);
    }

    private handleInvalidSession(payload: GatewayPayload) {
        if (payload.d) {
            this.resume();
        } else {
            this.resetState();
            this.identify();
        }
    }

    private onClose(event: CloseEvent) {
        console.error(
            debug_getTime(),
            "WebSocket closed. Code:",
            event.code,
            "Reason:",
            event.reason,
            "wasClean:",
            event.wasClean,
            "\n",
        );

        const resumeTime = 1000 * this.reconnectCounter;

        setTimeout(() => {
            if (this.canResume(event.code)) {
                this.resume();
            } else {
                console.error(debug_getTime(), "Cannot resume, starting a fresh connection...", "\n");
                this.reconnect();
            }

            this.reconnectCounter++;
        }, resumeTime);
    }

    private canResume(closeCode: number): boolean {
        return closeCodes.some((code) => code.code === closeCode && code.reconnect);
    }

    private resume() {
        if (!this.resumeGatewayUrl || !this.sessionId || this.lastSequenceNumber === null) {
            console.warn(
                debug_getTime(),
                "Cannot resume without resume gateway URL, session ID, or sequence number. Reconnecting...",
                "\n",
            );
            this.reconnect();
            return;
        }

        const resumePayload = {
            op: OpCodes.RESUME,
            d: {
                token: this.token,
                session_id: this.sessionId,
                seq: this.lastSequenceNumber,
            },
        };

        clearInterval(this.heartbeatInterval);

        this.socket.onclose = () => {
            console.log(debug_getTime(), "Closed old connection for resume.", "\n");
            this.socket = new WebSocket(this.resumeGatewayUrl!);
            this.socket.onopen = () => this.send(resumePayload);
            this.socket.onmessage = (event) => this.onMessage(event);
            this.socket.onerror = (event) => this.onError(event);
            this.socket.onclose = (event) => this.onClose(event);
        };
        this.close(4900, "Resume initialized.");
    }

    private reconnect() {
        this.resetState();

        const backoffTime = Math.min(2 ** this.reconnectAttempts + (Math.random() * 1000), 30000);
        setTimeout(() => {
            console.log(`Reconnecting in ${backoffTime / 1000} seconds...`);
            this.socket = new WebSocket(
                `${this.gatewayURL}?/v=${this.gatewayVersion}&encoding=${this.gatewayEncoding}`,
            );
            this.socket.onopen = () => this.onOpen();
            this.socket.onmessage = (event) => this.onMessage(event);
            this.socket.onerror = (event) => this.onError(event);
            this.socket.onclose = (event) => this.onClose(event);
        }, backoffTime);

        this.reconnectAttempts++;
        if (this.reconnectAttempts > this.maxReconnectAttempts) {
            console.error("Max reconnect attempts reached. Giving up.");
        }
    }

    private resetState() {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = undefined;
        this.lastSequenceNumber = null;
        this.resumeGatewayUrl = undefined;
        this.sessionId = undefined;
        this.reconnectAttempts = 0;
    }

    private onError(event: Event | ErrorEvent) {
        console.error(debug_getTime(), "WebSocket error:", event, "\n");
    }

    private handleDispatch(payload: GatewayPayload) {
        if (payload.t === "READY") {
            this.resumeGatewayUrl = payload.d.resume_gateway_url;
            this.sessionId = payload.d.session_id;
            this.reconnectCounter = 1;
        }

        if (payload.s) {
            this.lastSequenceNumber = payload.s;
        }

        this.emit(payload.t as DiscordEvents, payload.d);
    }

    private send(payload: GatewayPayload) {
        if (this.isRateLimited()) {
            console.warn(debug_getTime(), "Rate limited. Delaying sending.", "\n");
            setTimeout(() => this.send(payload), this.getRateLimitResetTime());
            return;
        }

        if (payload.op !== 1) {
            console.warn(debug_getTime(), JSON.stringify(payload), "\n");
        }
        this.socket.send(JSON.stringify(payload));
        this.updateRateLimitBucket();
    }
    private isRateLimited(): boolean {
        const now = Date.now();
        if (this.rateLimitReset && this.rateLimitReset > now && this.rateLimitRemaining === 0) {
            return true;
        }
        return false;
    }

    private getRateLimitResetTime(): number {
        if (this.rateLimitReset) {
            return this.rateLimitReset - Date.now();
        }
        return 0;
    }

    private updateRateLimitBucket() {
        const now = Date.now();
        this.rateLimitBucket.add(now);
        this.rateLimitRemaining--;

        setTimeout(() => {
            this.rateLimitBucket.forEach((time) => {
                if (time < now - 60000) {
                    this.rateLimitBucket.delete(time);
                    this.rateLimitRemaining++;
                }
            });

            if (this.rateLimitBucket.size === 0) {
                this.rateLimitReset = null;
            }
        }, 1000);

        if (this.rateLimitBucket.size >= 120) {
            this.rateLimitReset = now + 60000;
            this.rateLimitRemaining = 0;
        }
    }

    close(code?: number, reason?: string) {
        if (this.socket) {
            this.socket.close(code, reason);
        }
    }
}
