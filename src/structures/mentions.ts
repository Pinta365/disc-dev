import type { Snowflake } from "./snowflake.ts";

//https://discord.com/developers/docs/resources/channel#channel-mention-object
export interface ChannelMention {
    id: Snowflake;
    guild_id: Snowflake;
    type: number;
    name: string;
}
