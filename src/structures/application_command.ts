// structures/application_command.ts

export type ApplicationCommandType = 1 | 2 | 3 | 4; // CHAT_INPUT, USER, MESSAGE, PRIMARY_ENTRY_POINT

export interface ApplicationCommandChange {
    id?: string;
    version?: string;
    application_id?: string;
    name: string;
    description: string;
    type?: ApplicationCommandType;
    guild_id?: string;
    name_localizations?: { [key: string]: string };
    description_localizations?: { [key: string]: string };
    options?: ApplicationCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    default_permission?: boolean;
    nsfw?: boolean;
    integration_types?: number[];
    contexts?: number[];
    handler?: number;
}

export interface ApplicationCommand {
    id: string;
    version: string;
    application_id: string;
    name: string;
    description: string;
    type?: ApplicationCommandType;
    guild_id?: string;
    name_localizations?: { [key: string]: string };
    description_localizations?: { [key: string]: string };
    options?: ApplicationCommandOption[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    default_permission?: boolean;
    nsfw?: boolean;
    integration_types?: number[];
    contexts?: number[];
    handler?: number;
}

export interface ApplicationCommandOptionChoice {
    name: string;
    value: string | number;
}

export type ApplicationCommandOptionType =
    | 1 // SUB_COMMAND
    | 2 // SUB_COMMAND_GROUP
    | 3 // STRING
    | 4 // INTEGER
    | 5 // BOOLEAN
    | 6 // USER
    | 7 // CHANNEL
    | 8 // ROLE
    | 9 // MENTIONABLE
    | 10 // NUMBER
    | 11; // ATTACHMENT

export interface ApplicationCommandOption {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
    channel_types?: number[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}
