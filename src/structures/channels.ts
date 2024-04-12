import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";
import type { GuildMember } from "./guilds.ts";

//https://discord.com/developers/docs/resources/channel#channel-object
export interface Channel {
    id: Snowflake;
    type: ChannelType;
    guild_id?: Snowflake;
    position?: number;
    permission_overwrites?: Overwrite[];
    name?: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: Snowflake;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: User[];
    icon?: string;
    owner_id?: Snowflake;
    application_id?: Snowflake;
    managed?: boolean;
    parent_id?: Snowflake;
    last_pin_timestamp?: string;
    rtc_region?: string | null;
    video_quality_mode?: VideoQualityMode;
    message_count?: number;
    member_count?: number;
    thread_metadata?: ThreadMetadata;
    member?: ThreadMember;
    default_auto_archive_duration?: number;
    permissions?: string;
    flags?: number;
    total_message_sent?: number;
    available_tags?: Tag[];
    applied_tags?: Snowflake[];
    default_reaction_emoji?: DefaultReactionEmoji;
    default_thread_rate_limit_per_user?: number;
    default_sort_order?: SortOrderType;
    default_forum_layout?: ForumLayoutType;
}

export enum ChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
    GUILD_MEDIA = 16,
}

export enum VideoQualityMode {
    AUTO = 1,
    FULL = 2,
}

export enum SortOrderType {
    LATEST_ACTIVITY = 0,
    CREATION_DATE = 1,
}

export enum ForumLayoutType {
    NOT_SET = 0,
    LIST_VIEW = 1,
    GALLERY_VIEW = 2,
}

export interface Overwrite {
    id: Snowflake;
    type: 0 | 1; // 0 for role, 1 for member
    allow: string;
    deny: string;
}

export interface ThreadMetadata {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: string;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: string;
}

export interface ThreadMember {
    id?: Snowflake;
    user_id?: Snowflake;
    join_timestamp: string;
    flags: number;
    member?: GuildMember;
}

export interface DefaultReactionEmoji {
    emoji_id?: Snowflake;
    emoji_name?: string;
}

export interface Tag {
    id: Snowflake;
    name: string;
    moderated: boolean;
    emoji_id?: Snowflake;
    emoji_name?: string;
}
