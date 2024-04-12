import type { Presence } from "./presence.ts";

export interface GatewayPayload {
    op: OpCodes; // Opcode
    d: any; // Event data, (any JSON value)
    s?: number | null; // Sequence number
    t?: string | null; // Event name
}

export interface Identify {
    token: string;
    properties: IdentifyConnectionProperties;
    compress?: boolean;
    large_threshold?: number;
    shard?: [number, number];
    presence?: Presence;
    intents: number;
}

export interface IdentifyConnectionProperties {
    $os: string;
    $browser: string;
    $device: string;
}

export enum GatewayIntents {
    // https://discord.com/developers/docs/topics/gateway#list-of-intents
    GUILDS = 1 << 0,
    GUILD_MEMBERS = 1 << 1,
    GUILD_MODERATION = 1 << 2,
    GUILD_EMOJIS_AND_STICKERS = 1 << 3,
    GUILD_INTEGRATIONS = 1 << 4,
    GUILD_WEBHOOKS = 1 << 5,
    GUILD_INVITES = 1 << 6,
    GUILD_VOICE_STATES = 1 << 7,
    GUILD_PRESENCES = 1 << 8,
    GUILD_MESSAGES = 1 << 9,
    GUILD_MESSAGE_REACTIONS = 1 << 10,
    GUILD_MESSAGE_TYPING = 1 << 11,
    DIRECT_MESSAGES = 1 << 12,
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    DIRECT_MESSAGE_TYPING = 1 << 14,
    MESSAGE_CONTENT = 1 << 15,
    GUILD_SCHEDULED_EVENTS = 1 << 16,
    AUTO_MODERATION_CONFIGURATION = 1 << 20,
    AUTO_MODERATION_EXECUTION = 1 << 21,
}

export enum OpCodes {
    //https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
    DISPATCH = 0,
    HEARTBEAT = 1,
    IDENTIFY = 2,
    PRESENCE_UPDATE = 3,
    VOICE_STATE_UPDATE = 4,
    RESUME = 6,
    RECONNECT = 7,
    REQUEST_GUILD_MEMBERS = 8,
    INVALID_SESSION = 9,
    HELLO = 10,
    HEARTBEAT_ACK = 11,
}

export interface CloseCodeInfo {
    name: string;
    code: number;
    reconnect: boolean;
}

export const closeCodes: CloseCodeInfo[] = [
    // Standard WebSocket close codes and an "estimate" of reconnectable.
    { name: "Normal Closure", code: 1000, reconnect: false },
    { name: "Going Away", code: 1001, reconnect: false },
    { name: "Protocol error", code: 1002, reconnect: false },
    { name: "Unsupported Data", code: 1003, reconnect: false },
    { name: "Reserved (no status)", code: 1004, reconnect: false },
    { name: "No Status Received", code: 1005, reconnect: false },
    { name: "Abnormal Closure", code: 1006, reconnect: false },
    { name: "Invalid frame payload data", code: 1007, reconnect: false },
    { name: "Policy Violation", code: 1008, reconnect: false },
    { name: "Message Too Big", code: 1009, reconnect: false },
    { name: "Mandatory Extension", code: 1010, reconnect: false },
    { name: "Internal Server Error", code: 1011, reconnect: true },
    { name: "Service Restart", code: 1012, reconnect: true },
    { name: "Try Again Later", code: 1013, reconnect: true },
    { name: "Bad Gateway", code: 1014, reconnect: false },
    { name: "TLS Handshake Failure", code: 1015, reconnect: false },

    // Discord specific close codes
    { name: "Unknown Error", code: 4000, reconnect: true },
    { name: "Unknown Opcode", code: 4001, reconnect: true },
    { name: "Decode Error", code: 4002, reconnect: true },
    { name: "Not Authenticated", code: 4003, reconnect: true },
    { name: "Authentication Failed", code: 4004, reconnect: false },
    { name: "Already Authenticated", code: 4005, reconnect: true },
    { name: "Invalid Seq", code: 4007, reconnect: true },
    { name: "Rate Limited", code: 4008, reconnect: true },
    { name: "Session Timed Out", code: 4009, reconnect: true },
    { name: "Invalid Shard", code: 4010, reconnect: false },
    { name: "Sharding Required", code: 4011, reconnect: false },
    { name: "Invalid API Version", code: 4012, reconnect: false },
    { name: "Invalid Intent(s)", code: 4013, reconnect: false },
    { name: "Disallowed Intent(s)", code: 4014, reconnect: false },
];
