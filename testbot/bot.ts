// bot.ts - testing
import "@cross/env/load";
import { getEnv } from "@cross/env";

import { DiscordClient, DiscordEvents, GatewayIntents } from "../mod.ts";
import type { EmbelishedInteraction } from "../mod.ts";

const token = getEnv("TOKEN2")!;

const intents = [
    GatewayIntents.GUILDS,
];

const client = new DiscordClient({ token, intents });

client.on(DiscordEvents.Ready, () => {
    console.log("Bot is ready!");
});

client.on(DiscordEvents.InteractionCreate, (interaction: EmbelishedInteraction) => {
    if (!interaction.isChatInputCommand) return;

    console.log(interaction);
    if (interaction.interactionTarget === "greet1") {
        //interaction.reply("Pong!");

        interaction.reply({
            content: "Pong!",
        }, true);

        /*
        interaction.deferReply();
        await new Promise(resolve => setTimeout(resolve, 3000));
        interaction.editReply({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
                content: "Pong!",
            },
        });*/
    }
});
