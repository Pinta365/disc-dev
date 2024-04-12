import type { Snowflake } from "./snowflake.ts";

//https://discord.com/developers/docs/topics/permissions#role-object
export interface Role {
    id: Snowflake;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string;
    unicode_emoji?: string;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags;
    flags?: number;
}

export interface RoleTags {
    bot_id?: Snowflake;
    integration_id?: Snowflake;
    premium_subscriber?: null;
    subscription_listing_id?: Snowflake;
    available_for_purchase?: null;
    guild_connections?: null;
}

export interface RoleSubscriptionData {
    role_subscription_listing_id: Snowflake;
    tier_name: string;
    total_months_subscribed: number;
    is_renewal: boolean;
}
