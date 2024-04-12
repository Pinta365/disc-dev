import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";
import type { Role } from "./roles.ts";
import type { Emoji } from "./reactions.ts";
import type { Sticker } from "./stickers.ts";

//https://discord.com/developers/docs/resources/guild#guild-object
export interface Guild {
    id: Snowflake;
    name: string;
    icon?: string;
    icon_hash?: string;
    splash?: string;
    discovery_splash?: string;
    owner?: boolean;
    owner_id: Snowflake;
    permissions?: string;
    region?: string; // Deprecated
    afk_channel_id?: Snowflake;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: Snowflake;
    verification_level: VerificationLevel;
    default_message_notifications: DefaultMessageNotificationLevel;
    explicit_content_filter: ExplicitContentFilterLevel;
    roles: Role[];
    emojis: Emoji[];
    features: GuildFeature[];
    mfa_level: MFALevel;
    application_id?: Snowflake;
    system_channel_id?: Snowflake;
    system_channel_flags: SystemChannelFlags;
    rules_channel_id?: Snowflake;
    max_presences?: number;
    max_members?: number;
    vanity_url_code?: string;
    description?: string;
    banner?: string;
    premium_tier: PremiumTier;
    premium_subscription_count?: number;
    preferred_locale: string;
    public_updates_channel_id?: Snowflake;
    max_video_channel_users?: number;
    max_stage_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: WelcomeScreen;
    nsfw_level: NSFWLevel;
    stickers?: Sticker[];
    premium_progress_bar_enabled: boolean;
    safety_alerts_channel_id?: Snowflake;
}

//https://discord.com/developers/docs/resources/guild#guild-member-object
export interface GuildMember {
    user?: User;
    nick?: string;
    avatar?: string;
    roles: Snowflake[];
    joined_at: string;
    premium_since?: string;
    deaf: boolean;
    mute: boolean;
    flags?: number;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: string;
}

enum VerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

enum DefaultMessageNotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

enum MFALevel {
    NONE = 0,
    ELEVATED = 1,
}

enum PremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

enum GuildFeature {
    ANIMATED_BANNER = "ANIMATED_BANNER",
    ANIMATED_ICON = "ANIMATED_ICON",
    APPLICATION_COMMAND_PERMISSIONS_V2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
    AUTO_MODERATION = "AUTO_MODERATION",
    BANNER = "BANNER",
    COMMUNITY = "COMMUNITY",
    CREATOR_MONETIZABLE_PROVISIONAL = "CREATOR_MONETIZABLE_PROVISIONAL",
    CREATOR_STORE_PAGE = "CREATOR_STORE_PAGE",
    DEVELOPER_SUPPORT_SERVER = "DEVELOPER_SUPPORT_SERVER",
    DISCOVERABLE = "DISCOVERABLE",
    FEATURABLE = "FEATURABLE",
    INVITES_DISABLED = "INVITES_DISABLED",
    INVITE_SPLASH = "INVITE_SPLASH",
    MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
    MORE_STICKERS = "MORE_STICKERS",
    NEWS = "NEWS",
    PARTNERED = "PARTNERED",
    PREVIEW_ENABLED = "PREVIEW_ENABLED",
    RAID_ALERTS_DISABLED = "RAID_ALERTS_DISABLED",
    ROLE_ICONS = "ROLE_ICONS",
    ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
    ROLE_SUBSCRIPTIONS_ENABLED = "ROLE_SUBSCRIPTIONS_ENABLED",
    TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
    VANITY_URL = "VANITY_URL",
    VERIFIED = "VERIFIED",
    VIP_REGIONS = "VIP_REGIONS",
    WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}

enum NSFWLevel {
    DEFAULT = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

interface WelcomeScreen {
    description?: string;
    welcome_channels: WelcomeScreenChannel[];
}

interface WelcomeScreenChannel {
    channel_id: Snowflake;
    description: string;
    emoji_id?: Snowflake;
    emoji_name?: string;
}
