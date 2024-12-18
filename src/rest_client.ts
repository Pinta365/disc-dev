// rest_client.ts
import type { ApplicationCommand, ApplicationCommandChange } from "./structures/application_command.ts";
import type { Application } from "./structures/applications.ts";
import type { InteractionCallbackData, InteractionResponse } from "./structures/interactions.ts";
import { InteractionCallbackType } from "./structures/interactions.ts";
import type { Message } from "./structures/messages.ts";
import { MessageFlags } from "./structures/messages.ts";
import type { Snowflake } from "./structures/snowflake.ts";

class DiscordAPIError extends Error {
    statusCode: number;
    statusMessage: string;
    code?: number;
    errors?: unknown;

    constructor(statusCode: number, statusMessage: string, code?: number, errors?: unknown) {
        super(`REST request failed: ${statusCode} - ${statusMessage}`);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.code = code;
        this.errors = errors;
    }
}
export class DiscordRestClient {
    private token: string;
    private apiVersion: number;
    private userAgent: string;
    private currentApplicationId: Snowflake | undefined = undefined;

    constructor(token: string, apiVersion = 10) {
        this.token = token;
        this.apiVersion = apiVersion;
        this.userAgent = `@pinta365/discordbot (https://github.com/Pinta365/disc-dev, 0.0.1)`; //Should be configurable
    }

    private buildApiURL(endpoint: string): string {
        return `https://discord.com/api/v${this.apiVersion}${endpoint}`;
    }

    private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
        const url = this.buildApiURL(endpoint);
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": this.userAgent,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => undefined);

            throw new DiscordAPIError(
                response.status,
                response.statusText,
                errorData?.code,
                errorData?.errors,
            );
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
            return await response.json() as T;
        } else {
            return await response.text() as unknown as T;
        }
    }

    async getCurrentApplicationId(): Promise<Snowflake> {
        if (!this.currentApplicationId) {
            const app = await this.request<Application>("GET", `/applications/@me`);
            this.currentApplicationId = app.id;
            return this.currentApplicationId;
        } else {
            return this.currentApplicationId;
        }
    }

    // GLOBAL
    async createGlobalCommand(
        applicationId: string,
        commandData: ApplicationCommandChange,
    ): Promise<ApplicationCommand> {
        return await this.request("POST", `/applications/${applicationId}/commands`, commandData);
    }

    async getGlobalCommands(applicationId: string): Promise<ApplicationCommand[]> {
        return await this.request("GET", `/applications/${applicationId}/commands`);
    }

    async getGlobalCommand(applicationId: string, commandId: string): Promise<ApplicationCommand> {
        return await this.request("GET", `/applications/${applicationId}/commands/${commandId}`);
    }

    async editGlobalCommand(
        applicationId: string,
        commandId: string,
        commandData: Partial<ApplicationCommandChange>,
    ): Promise<ApplicationCommand> {
        return await this.request("PATCH", `/applications/${applicationId}/commands/${commandId}`, commandData);
    }

    async deleteGlobalCommand(applicationId: string, commandId: string): Promise<void> {
        await this.request("DELETE", `/applications/${applicationId}/commands/${commandId}`);
    }

    async bulkOverwriteGlobalCommands(
        applicationId: string,
        commandsData: ApplicationCommandChange[],
    ): Promise<ApplicationCommand[]> {
        return await this.request("PUT", `/applications/${applicationId}/commands`, commandsData);
    }

    // GUILD
    async createGuildCommand(
        applicationId: string,
        guildId: string,
        commandData: ApplicationCommandChange,
    ): Promise<ApplicationCommand> {
        return await this.request(
            "POST",
            `/applications/${applicationId}/guilds/${guildId}/commands`,
            commandData,
        );
    }

    async getGuildCommands(applicationId: string, guildId: string): Promise<ApplicationCommand[]> {
        return await this.request("GET", `/applications/${applicationId}/guilds/${guildId}/commands`);
    }

    async getGuildCommand(applicationId: string, guildId: string, commandId: string): Promise<ApplicationCommand> {
        return await this.request("GET", `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`);
    }

    async editGuildCommand(
        applicationId: string,
        guildId: string,
        commandId: string,
        commandData: Partial<ApplicationCommandChange>,
    ): Promise<ApplicationCommand> {
        return await this.request(
            "PATCH",
            `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
            commandData,
        );
    }

    async deleteGuildCommand(applicationId: string, guildId: string, commandId: string): Promise<void> {
        return await this.request(
            "DELETE",
            `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
        );
    }

    async bulkOverwriteGuildCommands(
        applicationId: string,
        guildId: string,
        commandsData: ApplicationCommandChange[],
    ): Promise<ApplicationCommand[]> {
        return await this.request(
            "PUT",
            `/applications/${applicationId}/guilds/${guildId}/commands`,
            commandsData,
        );
    }

    async createInteractionResponse(
        interactionId: string,
        interactionToken: string,
        type?: InteractionCallbackType,
        data?: InteractionCallbackData | string,
        ephemeral?: boolean,
    ) {
        const responseObj: InteractionResponse = typeof data === "string"
            ? {
                type: type ?? InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: data },
            }
            : {
                type: type ?? InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: data,
            };

        if (ephemeral) {
            responseObj.data = responseObj.data || {};
            responseObj.data.flags = (responseObj.data.flags || 0) | MessageFlags.EPHEMERAL;
        }

        await this.request(
            "POST",
            `/interactions/${interactionId}/${interactionToken}/callback`,
            responseObj,
        );
    }

    async getOriginalInteractionResponse(
        applicationId: string,
        interactionToken: string,
    ): Promise<Message> {
        return await this.request(
            "GET",
            `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
        );
    }

    async editOriginalInteractionResponse(
        applicationId: string,
        interactionToken: string,
        message: Partial<Message>,
    ): Promise<Message> {
        return await this.request(
            "PATCH",
            `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
            message,
        );
    }

    async createFollowupMessage(
        applicationId: string,
        interactionToken: string,
        message: Partial<Message> | string,
        ephemeral?: boolean,
    ): Promise<void> {
        const msgObj: Partial<Message> = typeof message === "string" ? { content: message } : message;

        if (ephemeral) {
            message = message || {};
            msgObj.flags = (msgObj.flags || 0) | MessageFlags.EPHEMERAL;
        }

        await this.request(
            "POST",
            `/webhooks/${applicationId}/${interactionToken}`,
            msgObj,
        );
    }
}
