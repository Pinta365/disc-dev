// ./src/gateway.ts
import { closeCodes, OpCodes } from "./structures/gateway.ts";
import { DiscordEvents } from "./structures/gateway.ts";
import type { DiscordClient } from "./client.ts";
import type { GatewayBotData, GatewayIntents, GatewayPayload, Identify } from "./structures/gateway.ts";
import type { User } from "./structures/users.ts";
import { ActivityType } from "./structures/activities.ts";
import { Logger } from "./utils.ts";

const DEFAULT_COMMAND_TTL = 5000;

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
    private socket: WebSocket | null = null;
    private heartbeatInterval: number | undefined;
    private token: string;
    private intents: GatewayIntents[];
    private lastSequenceNumber: number | null = null;
    private resumeGatewayUrl: string | undefined = undefined;
    private sessionId: string | undefined = undefined;
    private reconnectCounter = 1;
    private gatewayURL: string | undefined;
    private gatewayVersion: number;
    private gatewayEncoding: string;
    private rateLimitBucket: Set<number> = new Set();
    private rateLimitReset: number | null = null;
    private rateLimitRemaining = 120;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;
    private sessionStartLimit: GatewayBotData["session_start_limit"] | null = null;
    private messageQueue: { payload: GatewayPayload; timestamp: number }[] = [];
    private isReconnecting = false;
    private botUser: User | null = null;
    private discordClient: DiscordClient;
    private queueableOpcodes: OpCodes[] = [
        OpCodes.IDENTIFY,
        // Queueable codes to whitelist
    ];

    constructor(
        token: string,
        intents: GatewayIntents[],
        version: number,
        _compression: boolean,
        discordClient: DiscordClient,
    ) {
        this.token = token;
        this.intents = intents;
        this.gatewayVersion = version;
        this.gatewayEncoding = "json"; // make configurable at some point
        this.discordClient = discordClient;

        fetch(`https://discord.com/api/v${this.gatewayVersion}/gateway/bot`, {
            headers: { Authorization: `Bot ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch gateway URL: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((gatewayBotData: GatewayBotData) => {
                this.sessionStartLimit = gatewayBotData.session_start_limit;
                this.gatewayURL = gatewayBotData.url;
                this.socket = new WebSocket(
                    `${this.gatewayURL}?/v=${this.gatewayVersion}&encoding=${this.gatewayEncoding}`,
                );
                this.socket.onopen = () => this.onOpen();
                this.socket.onmessage = (event) => this.onMessage(event);
                this.socket.onclose = (event) => this.onClose(event);
                this.socket.onerror = (event) => this.onError(event);
            })
            .catch((error) => {
                Logger.error("Error fetching Gateway URL:", error);
            });
    }
    /*
    // deno-lint-ignore no-explicit-any
    //private listeners: { [event: string]: ((...args: any[]) => void)[] } = {};

    // deno-lint-ignore no-explicit-any
    on(event: DiscordEvents, callback: (...args: any[]) => void) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
    }

    // deno-lint-ignore no-explicit-any
    private emit(event: DiscordEvents, ...args: any[]) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => listener(...args));
        }
    }
    */
    private onOpen() {
        this.isReconnecting = false;
        this.identify();
        this.flushMessageQueue();
    }

    getBotUser() {
        return this.botUser;
    }

    private flushMessageQueue() {
        const now = Date.now();
        while (this.messageQueue.length > 0) {
            const { payload, timestamp } = this.messageQueue.shift()!;
            if (now - timestamp < DEFAULT_COMMAND_TTL) {
                this.send(payload);
            } else {
                Logger.warn("Dropped expired command from queue (TTL exceeded):", payload);
            }
        }
    }

    private onMessage(event: MessageEvent) {
        const payload: GatewayPayload = JSON.parse(event.data as string);

        /*if (payload.op !== 11) {
            Logger.debug(payload.t, payload.op);
        }*/
        Logger.debug(payload.t, payload.op);
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
                Logger.debug(payload);
        }
    }

    private identify() {
        if (this.sessionStartLimit && this.sessionStartLimit.remaining === 0) {
            const resetTime = this.sessionStartLimit.reset_after;
            console.warn(`Session start limit reached. Retrying in ${resetTime / 1000} seconds...`);
            setTimeout(() => this.identify(), resetTime);
            return;
        }

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

        if (this.sessionStartLimit) {
            this.sessionStartLimit.remaining--;
        }
    }

    private startHeartbeat(interval: number) {
        this.heartbeatInterval = setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
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
        Logger.error(
            debug_getTime(),
            "WebSocket closed. Code:",
            event.code,
            "Reason:",
            event.reason,
            "wasClean:",
            event.wasClean,
        );

        const resumeTime = 1000 * this.reconnectCounter;

        setTimeout(() => {
            if (this.canResume(event.code)) {
                this.resume();
            } else {
                Logger.error("Cannot resume, starting a fresh connection...");
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
            Logger.warn(
                debug_getTime(),
                "Cannot resume without resume gateway URL, session ID, or sequence number. Reconnecting...",
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

        if (this.socket) {
            this.socket.onclose = () => {
                Logger.info("Closed old connection for resume.");
                this.socket = new WebSocket(this.resumeGatewayUrl!);
                this.socket.onopen = () => this.send(resumePayload);
                this.socket.onmessage = (event) => this.onMessage(event);
                this.socket.onerror = (event) => this.onError(event);
                this.socket.onclose = (event) => this.onClose(event);
            };
            this.close(4900, "Resume initialized.");
        } else {
            Logger.warn("Cannot resume: WebSocket is not initialized.");
        }
    }

    private reconnect() {
        this.isReconnecting = true;
        if (this.sessionStartLimit && this.sessionStartLimit.remaining === 0) {
            const resetTime = this.sessionStartLimit.reset_after;
            Logger.warn(`Session start limit reached. Retrying in ${resetTime / 1000} seconds...`);
            setTimeout(() => this.reconnect(), resetTime);
            return;
        }

        this.resetState();

        const backoffTime = Math.min(2 ** this.reconnectAttempts + (Math.random() * 1000), 30000);
        setTimeout(() => {
            Logger.info(`Reconnecting in ${backoffTime / 1000} seconds...`);
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
            Logger.error("Max reconnect attempts reached. Giving up.");
        }

        if (this.sessionStartLimit) {
            this.sessionStartLimit.remaining--;
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
        Logger.error("WebSocket error:", event);
    }

    private handleDispatch(payload: GatewayPayload) {
        if (payload.t === DiscordEvents.Ready) {
            this.resumeGatewayUrl = payload.d.resume_gateway_url;
            this.sessionId = payload.d.session_id;
            this.botUser = payload.d.user ? { ...payload.d.user } : null;
            this.reconnectCounter = 1;
        }

        if (payload.t === DiscordEvents.InteractionCreate) {
            //Embelish interaction
        }

        if (payload.s) {
            this.lastSequenceNumber = payload.s;
        }

        //this.emit(payload.t as DiscordEvents, payload.d);
        this.discordClient.handleDispatch(payload);
    }

    private send(payload: GatewayPayload) {
        if (this.isRateLimited()) {
            Logger.warn("Rate limited. Delaying sending.");
            setTimeout(() => this.send(payload), this.getRateLimitResetTime());
            return;
        }

        if (payload.op !== 1) {
            Logger.debug(JSON.stringify(payload));
        }
        if (this.isReconnecting || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
            if (this.queueableOpcodes.includes(payload.op)) {
                // Store payload with timestamp
                this.messageQueue.push({ payload, timestamp: Date.now() });
                Logger.debug("Gateway connection is not open. Message queued.");
            } else {
                Logger.debug("Opcode not whitelisted for queuing:", payload.op);
            }
        } else {
            this.socket.send(JSON.stringify(payload));
            this.updateRateLimitBucket();
        }
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
