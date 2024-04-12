import type { Snowflake } from "./snowflake.ts";

//https://discord.com/developers/docs/topics/gateway-events#activity-object
export interface Activity {
    name: string;
    type: ActivityType;
    url?: string;
    created_at?: number;
    timestamps?: ActivityTimestamps;
    application_id?: Snowflake;
    details?: string;
    state?: string;
    emoji?: ActivityEmoji;
    party?: ActivityParty;
    assets?: ActivityAssets;
    secrets?: ActivitySecrets;
    instance?: boolean;
    flags?: number; // Activity flags
    buttons?: ActivityButton[];
}

export interface ActivityTimestamps {
    start?: number;
    end?: number;
}

export interface ActivityEmoji {
    name: string;
    id?: Snowflake;
    animated?: boolean;
}

export interface ActivityParty {
    id?: string;
    size?: [number, number]; // [current_size, max_size]
}

export interface ActivityAssets {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
}

export interface ActivitySecrets {
    join?: string;
    spectate?: string;
    match?: string;
}

export interface ActivityButton {
    label: string;
    url: string;
}

export enum ActivityType {
    GAME = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
}
