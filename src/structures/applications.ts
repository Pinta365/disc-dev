import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";
import type { Guild } from "./guilds.ts";

//https://discord.com/developers/docs/resources/application#application-object
export interface Application {
    id: Snowflake;
    name: string;
    icon?: string;
    description: string;
    rpc_origins?: string[];
    bot_public: boolean;
    bot_require_code_grant: boolean;
    bot?: Partial<User>;
    terms_of_service_url?: string;
    privacy_policy_url?: string;
    owner?: Partial<User>;
    summary: string; // Deprecated
    verify_key: string;
    team?: Team;
    guild_id?: Snowflake;
    guild?: Partial<Guild>;
    primary_sku_id?: Snowflake;
    slug?: string;
    cover_image?: string;
    flags?: number;
    approximate_guild_count?: number;
    redirect_uris?: string[];
    interactions_endpoint_url?: string;
    role_connections_verification_url?: string;
    tags?: string[];
    install_params?: InstallParams;
    integration_types_config?: Record<ApplicationIntegrationType, IntegrationTypeConfiguration>;
    custom_install_url?: string;
}

export interface Team {
    icon?: string;
    id: Snowflake;
    members: TeamMember[];
}

export interface TeamMember {
    membership_state: number;
    permissions: string[];
    team_id: Snowflake;
    user: User;
}

export interface InstallParams {
    scopes: string[];
    permissions: string;
}

export interface IntegrationTypeConfiguration {
    oauth2_install_params?: InstallParams;
}

export enum ApplicationIntegrationType {
    GUILD_INSTALL = 0,
    USER_INSTALL = 1,
}
