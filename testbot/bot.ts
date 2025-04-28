// bot.ts - testing
import "@cross/env/load";
import { getEnv } from "@cross/env";

import { DiscordClient, DiscordEvents, GatewayIntents } from "../mod.ts";
import type { EmbelishedInteraction, Message } from "../mod.ts";
import { LogLevel } from "../src/utils.ts";

const token = getEnv("TOKEN2")!;

const intents = [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MESSAGES,
];

const client = new DiscordClient({
    token,
    intents,
    apiVersion: 10,
    gatewayCompression: false,
    logLevel: LogLevel.DEBUG,
});

client.on(DiscordEvents.Ready, () => {
    console.log(`Logged in as ${client.botName(true)}!`);
});

client.on(DiscordEvents.InteractionCreate, (interaction: EmbelishedInteraction) => {
    if (!interaction.isChatInputCommand) return;

    //console.log(interaction);
    if (interaction.interactionTarget === "greet1") {
        //interaction.reply("Pong!");

        interaction.reply({
            content: "Pong!",
        });

        //interaction.followUp({ content: "Pong edited!" });
        interaction.followUp("Pong edited!", true);
    }
});

client.on(DiscordEvents.MessageCreate, (message: Message) => {
    console.log("Message create:", message.id);
});
