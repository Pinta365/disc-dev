import type { Presence } from "./presence.ts";

export interface GatewayPayload {
    op: OpCodes; // Opcode
    d: any; // Event data, (any JSON value)
    s?: number | null; // Sequence number
    t?: string | null; // Event name
}

export enum DiscordEvents {
    Ready = "READY",
    MessageCreate = "MESSAGE_CREATE",
    MessageDelete = "MESSAGE_DELETE",
    MessageUpdate = "MESSAGE_UPDATE",
    MessageDeleteBulk = "MESSAGE_DELETE_BULK",
    MessageReactionAdd = "MESSAGE_REACTION_ADD",
    MessageReactionRemove = "MESSAGE_REACTION_REMOVE",
    MessageReactionRemoveAll = "MESSAGE_REACTION_REMOVE_ALL",
    MessageReactionRemoveEmoji = "MESSAGE_REACTION_REMOVE_EMOJI",
    TypingStart = "TYPING_START",
    GuildCreate = "GUILD_CREATE",
    GuildUpdate = "GUILD_UPDATE",
    GuildDelete = "GUILD_DELETE",
    GuildRoleCreate = "GUILD_ROLE_CREATE",
    GuildRoleUpdate = "GUILD_ROLE_UPDATE",
    GuildRoleDelete = "GUILD_ROLE_DELETE",
    ChannelCreate = "CHANNEL_CREATE",
    ChannelUpdate = "CHANNEL_UPDATE",
    ChannelDelete = "CHANNEL_DELETE",
    ChannelPinsUpdate = "CHANNEL_PINS_UPDATE",
    ThreadCreate = "THREAD_CREATE",
    ThreadUpdate = "THREAD_UPDATE",
    ThreadDelete = "THREAD_DELETE",
    ThreadListSync = "THREAD_LIST_SYNC",
    ThreadMemberUpdate = "THREAD_MEMBER_UPDATE",
    ThreadMembersUpdate = "THREAD_MEMBERS_UPDATE",
    StageInstanceCreate = "STAGE_INSTANCE_CREATE",
    StageInstanceUpdate = "STAGE_INSTANCE_UPDATE",
    StageInstanceDelete = "STAGE_INSTANCE_DELETE",
    GuildMemberAdd = "GUILD_MEMBER_ADD",
    GuildMemberUpdate = "GUILD_MEMBER_UPDATE",
    GuildMemberRemove = "GUILD_MEMBER_REMOVE",
    GuildBanAdd = "GUILD_BAN_ADD",
    GuildBanRemove = "GUILD_BAN_REMOVE",
    GuildAuditLogEntryCreate = "GUILD_AUDIT_LOG_ENTRY_CREATE",
    GuildEmojisUpdate = "GUILD_EMOJIS_UPDATE",
    GuildStickersUpdate = "GUILD_STICKERS_UPDATE",
    GuildIntegrationsUpdate = "GUILD_INTEGRATIONS_UPDATE",
    IntegrationCreate = "INTEGRATION_CREATE",
    IntegrationUpdate = "INTEGRATION_UPDATE",
    IntegrationDelete = "INTEGRATION_DELETE",
    WebhooksUpdate = "WEBHOOKS_UPDATE",
    InviteCreate = "INVITE_CREATE",
    InviteDelete = "INVITE_DELETE",
    VoiceStateUpdate = "VOICE_STATE_UPDATE",
    PresenceUpdate = "PRESENCE_UPDATE",
    GuildScheduledEventCreate = "GUILD_SCHEDULED_EVENT_CREATE",
    GuildScheduledEventUpdate = "GUILD_SCHEDULED_EVENT_UPDATE",
    GuildScheduledEventDelete = "GUILD_SCHEDULED_EVENT_DELETE",
    GuildScheduledEventUserAdd = "GUILD_SCHEDULED_EVENT_USER_ADD",
    GuildScheduledEventUserRemove = "GUILD_SCHEDULED_EVENT_USER_REMOVE",
    AutoModerationRuleCreate = "AUTO_MODERATION_RULE_CREATE",
    AutoModerationRuleUpdate = "AUTO_MODERATION_RULE_UPDATE",
    AutoModerationRuleDelete = "AUTO_MODERATION_RULE_DELETE",
    AutoModerationActionExecution = "AUTO_MODERATION_ACTION_EXECUTION",
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

//https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
export enum OpCodes {
    // Receive - An event was dispatched.
    DISPATCH = 0,
    // Send/Receive - Fired periodically by the client to keep the connection alive.
    HEARTBEAT = 1,
    // 	Send - Starts a new session during the initial handshake.
    IDENTIFY = 2,
    // Send - Update the client's presence.
    PRESENCE_UPDATE = 3,
    // 	Send - Used to join/leave or move between voice channels.
    VOICE_STATE_UPDATE = 4,
    // Send - Resume a previous session that was disconnected.
    RESUME = 6,
    // 	Receive - You should attempt to reconnect and resume immediately.
    RECONNECT = 7,
    // Send - Request information about offline guild members in a large guild.
    REQUEST_GUILD_MEMBERS = 8,
    // 	Receive - The session has been invalidated. You should reconnect and identify/resume accordingly.
    INVALID_SESSION = 9,
    // 	Receive - Sent immediately after connecting, contains the heartbeat_interval to use.
    HELLO = 10,
    // 	Receive - Sent in response to receiving a heartbeat to acknowledge that it has been received.
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

    // Library specific codes
    { name: "Reconnect Event", code: 4900, reconnect: true },
];
