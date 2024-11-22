// structures/application_command.ts

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
    PRIMARY_ENTRY_POINT = 4,
}

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

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

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
