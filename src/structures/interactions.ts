// structures/interaction.ts

import type { ApplicationCommandOptionType } from "./application_command.ts";
import type { User } from "./users.ts";
import type { Message } from "./messages.ts";
import type { Channel } from "./channels.ts";
import type { Role } from "./roles.ts";
import type { Attachment } from "./attachments.ts";
import type { Entitlement } from "./entitlements.ts";
import type { Guild, GuildMember } from "./guilds.ts";
import type { Embed } from "./embeds.ts";
import type { AllowedMentions } from "./mentions.ts";
import type { ActionRow } from "./messages.ts";

export enum InteractionCallbackType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9,
    LAUNCH_ACTIVITY = 12,
}

export interface InteractionResponse {
    type: InteractionCallbackType;
    data?: InteractionCallbackData;
}

export interface InteractionCallbackData {
    tts?: boolean;
    content?: string;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    flags?: number;
    components?: ActionRow[];
    attachments?: Attachment[];
}
export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
    PRIMARY_ENTRY_POINT = 4,
}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

export enum InteractionContextType {
    GUILD = 0,
    BOT_DM = 1,
    PRIVATE_CHANNEL = 2,
}

export interface EmbelishedInteraction {
    rawInteraction: Interaction;
    isChatInputCommand: boolean;
    isMessageComponent: boolean;
    isApplicationCommandAutocomplete: boolean;
    isModalSubmit: boolean;
    isUserCommand: boolean;
    isMessageCommand: boolean;

    interactionTarget: string;

    reply(response: InteractionCallbackData, ephemeral?: boolean): Promise<void>;
    deferReply(): Promise<void>;
    update(message: Partial<Message>): Promise<void>;
    deferUpdate(): Promise<void>;
    //editReply(): Promise<>;
    //followUp(): Promise<>;
}

export interface Interaction {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: InteractionData;
    guild?: Partial<Guild>;
    guild_id?: string;
    channel?: Partial<Channel>;
    channel_id?: string;
    member?: GuildMember;
    user?: User;
    token: string;
    version: 1;
    message?: Message;
    app_permissions?: string;
    locale?: string;
    guild_locale?: string;
    entitlements?: Entitlement[];
    authorizing_integration_owners?: Record<string, string>;
    context?: InteractionContextType;
}

export interface InteractionData {
    id: string;
    name: string;
    type: ApplicationCommandOptionType;
    resolved?: ResolvedData;
    options?: ApplicationCommandInteractionDataOption[];
    guild_id?: string;
    target_id?: string;
    custom_id?: string;
    component_type?: number;
    values?: string[];
}

export interface ResolvedData {
    users?: Record<string, User>;
    members?: Record<string, Partial<GuildMember>>;
    roles?: Record<string, Role>;
    channels?: Record<string, Partial<Channel>>;
    messages?: Record<string, Partial<Message>>;
    attachments?: Record<string, Attachment>;
}

export interface ApplicationCommandInteractionDataOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    options?: ApplicationCommandInteractionDataOption[];
    focused?: boolean;
}
