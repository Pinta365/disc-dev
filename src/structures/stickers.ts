import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";

//https://discord.com/developers/docs/resources/sticker#sticker-object
export interface Sticker {
    id: Snowflake;
    pack_id?: Snowflake;
    name: string;
    description?: string;
    tags: string;
    asset?: string; // deprecated
    type: StickerType;
    format_type: StickerFormatType;
    available?: boolean;
    guild_id?: Snowflake;
    user?: User;
    sort_value?: number;
}

export interface MessageStickerItem {
    id: Snowflake;
    name: string;
    format_type: StickerFormatType;
}

export enum StickerType {
    STANDARD = 1,
    GUILD = 2,
}

export enum StickerFormatType {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
    GIF = 4,
}
