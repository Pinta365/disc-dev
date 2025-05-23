//./src/embelish.ts
import type { Message } from "./structures/messages.ts";
import { type Interaction, InteractionCallbackType, InteractionType } from "./structures/interactions.ts";
import type { EmbelishedInteraction, InteractionCallbackData } from "./structures/interactions.ts";
import { ApplicationCommandType } from "./structures/application_command.ts";
import type { DiscordRestClient } from "./rest_client.ts";

export function embelishInteraction(interaction: Interaction, rest: DiscordRestClient): EmbelishedInteraction {
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
        isApplicationCommandAutocomplete: interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
        isModalSubmit: interaction.type === InteractionType.MODAL_SUBMIT,
        isUserCommand: (interaction.type === InteractionType.APPLICATION_COMMAND &&
            interaction.data.type === ApplicationCommandType.USER),
        isMessageCommand: (interaction.type === InteractionType.APPLICATION_COMMAND &&
            interaction.data.type === ApplicationCommandType.MESSAGE),

        interactionTarget: interactionTarget,
        applicationId: interaction.application_id,
        channelId: interaction.channel_id,
        guildId: interaction.guild_id,

        reply: async (response: InteractionCallbackData | string, ephemeral?: boolean) => {
            await rest.createInteractionResponse(
                interaction.id,
                interaction.token,
                undefined,
                response,
                ephemeral,
            );
        },

        editReply: async (message: Partial<Message>) => {
            await rest.editOriginalInteractionResponse(
                interaction.application_id,
                interaction.token,
                message,
            );
        },

        deferReply: async () => { // EPHEMERAL?
            await rest.createInteractionResponse(
                interaction.id,
                interaction.token,
                InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            );
        },

        followUp: async (response: InteractionCallbackData | string, ephemeral?: boolean) => {
            await rest.createFollowupMessage(
                interaction.application_id,
                interaction.token,
                response,
                ephemeral,
            );
        },

        update: async (message: Partial<Message>) => {
            await rest.createInteractionResponse(
                interaction.id,
                interaction.token,
                InteractionCallbackType.UPDATE_MESSAGE,
                message,
            );
        },

        deferUpdate: async () => {
            await rest.createInteractionResponse(
                interaction.id,
                interaction.token,
                InteractionCallbackType.DEFERRED_UPDATE_MESSAGE,
            );
        },
    };

    return embelishedInteraction;
}
