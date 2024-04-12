import type { Activity } from "./activities.ts";

//https://discord.com/developers/docs/topics/gateway-events#update-presence
export interface Presence {
    since?: number; // Unix time in milliseconds, null if not idle
    activities: Activity[];
    status: PresenceStatus;
    afk: boolean;
}

export type PresenceStatus = "online" | "dnd" | "idle" | "invisible" | "offline";
