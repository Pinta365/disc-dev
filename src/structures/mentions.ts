import type { Snowflake } from "./snowflake.ts";

//https://discord.com/developers/docs/resources/channel#channel-mention-object
export interface ChannelMention {
    id: Snowflake;
    guild_id: Snowflake;
    type: number;
    name: string;
}

export type AllowedMentionType = "roles" | "users" | "everyone";

export interface AllowedMentions {
    parse: AllowedMentionType[];
    roles?: string[];
    users?: string[];
    replied_user?: boolean;
}
