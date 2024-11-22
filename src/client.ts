// ./src/client.ts
import { Gateway } from "./gateway.ts";
import { DiscordEvents, type GatewayIntents } from "./structures/gateway.ts";
import type { Message } from "./structures/messages.ts";
import { InteractionCallbackType, InteractionType } from "./structures/interactions.ts";
import type { EmbelishedInteraction, InteractionCallbackData } from "./structures/interactions.ts";
import { ApplicationCommandType } from "./structures/application_command.ts";
import { DiscordRestClient } from "./rest_client.ts";

interface ClientOptions {
    token: string;
    intents?: GatewayIntents[];
}

export class DiscordClient {
    private gateway: Gateway | null = null;
    private rest: DiscordRestClient;

    constructor(options: ClientOptions) {
        const intents = options.intents || [];
        this.rest = new DiscordRestClient(options.token, 10);

        this.gateway = new Gateway(options.token, intents);

        if (this.gateway) {
            this.gateway.on(DiscordEvents.InteractionCreate, (interaction) => {
                let interactionTarget = "";
                if (interaction.type === InteractionType.APPLICATION_COMMAND) {
                    interactionTarget = interaction.data?.name || "";
                } else if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
                    interactionTarget = interaction.data?.custom_id || "";
                } else if (interaction.type === InteractionType.MODAL_SUBMIT) {
                    interactionTarget = interaction.data?.custom_id || "";
                }

                const embelishedInteraction: EmbelishedInteraction = {
                    rawInteraction: interaction,
                    isChatInputCommand: (interaction.type === InteractionType.APPLICATION_COMMAND &&
                        interaction.data.type === ApplicationCommandType.CHAT_INPUT),
                    isMessageComponent: interaction.type === InteractionType.MESSAGE_COMPONENT,
                    isApplicationCommandAutocomplete:
                        interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
                    isModalSubmit: interaction.type === InteractionType.MODAL_SUBMIT,
                    isUserCommand: (interaction.type === InteractionType.APPLICATION_COMMAND &&
                        interaction.data.type === ApplicationCommandType.USER),
                    isMessageCommand: (interaction.type === InteractionType.APPLICATION_COMMAND &&
                        interaction.data.type === ApplicationCommandType.MESSAGE),

                    interactionTarget: interactionTarget,

                    reply: async (response: InteractionCallbackData, ephemeral?: boolean) => {
                        await this.rest.createInteractionResponse(
                            interaction.id,
                            interaction.token,
                            undefined,
                            response,
                            ephemeral,
                        );
                    },

                    deferReply: async () => {
                        await this.rest.createInteractionResponse(
                            interaction.id,
                            interaction.token,
                            InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                        );
                    },

                    update: async (message: Partial<Message>) => {
                        await this.rest.createInteractionResponse(
                            interaction.id,
                            interaction.token,
                            InteractionCallbackType.UPDATE_MESSAGE,
                            message,
                        );
                    },

                    deferUpdate: async () => {
                        await this.rest.createInteractionResponse(
                            interaction.id,
                            interaction.token,
                            InteractionCallbackType.DEFERRED_UPDATE_MESSAGE,
                        );
                    },
                    /*
                    //Not implemented
                    editReply: async () => {
                    },

                    followUp: async () => {
                    },
                    */
                };

                this.emit(DiscordEvents.InteractionCreate, embelishedInteraction);
            });
        }
    }

    // deno-lint-ignore no-explicit-any
    private listeners: { [event in DiscordEvents]?: (...args: any[]) => void } = {};
    // deno-lint-ignore no-explicit-any
    on<T extends DiscordEvents>(event: T, callback: (...args: any[]) => void): void {
        this.listeners[event] = callback;
    }
    // deno-lint-ignore no-explicit-any
    private emit<T extends DiscordEvents>(event: T, ...args: any[]) {
        if (this.listeners[event]) {
            this.listeners[event]?.(...args);
        }
    }

    closeSocket(code?: number, reason?: string): void {
        if (this.gateway) {
            this.gateway.close(code, reason);
        }
    }
}
