import type { Snowflake } from "./snowflake.ts";

//https://discord.com/developers/docs/resources/channel#attachment-object
export interface Attachment {
    id: Snowflake;
    filename?: string;
    description?: string;
    content_type?: string;
    size?: number;
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
    ephemeral?: boolean;
    duration_secs?: number;
    waveform?: string;
    flags?: number;
}
