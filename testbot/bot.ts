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

client.on(DiscordEvents.Ready, (payload) => {
    console.log("test");
    console.log(`Logged in as ${payload.user.username}!`);
});

client.on(DiscordEvents.InteractionCreate, (interaction: EmbelishedInteraction) => {
    if (!interaction.isChatInputCommand) return;

    console.log(interaction);
    if (interaction.interactionTarget === "greet1") {
        //interaction.reply("Pong!");

        interaction.reply({
            content: "Pong!",
        });

        //interaction.followUp({ content: "Pong edited!" });
        interaction.followUp("Pong edited!", true);
    }
});
