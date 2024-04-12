import "@cross/env/load";
import { getEnv } from "@cross/env";

import { DiscordClient } from "../mod.ts";
import { DiscordEvents } from "../src/constants.ts";
import { GatewayIntents } from "../src/structures/gateway.ts";
import type { Message } from "../src/structures/messages.ts";

const token = getEnv("TOKEN");

const intents = [
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.MESSAGE_CONTENT,
];

const client = new DiscordClient({ token, intents });

client.on(DiscordEvents.Ready, () => {
  console.log("Bot is ready!");
});

client.on(DiscordEvents.MessageCreate, (message: Message) => {
  console.log("Message create:", message.id);
});

client.on(DiscordEvents.MessageUpdate, (message: Message) => {
  console.log("Message update:", message.id);
});

client.on(DiscordEvents.MessageDelete, (message: Message) => {
  console.log("Message delete:", message.id);
});
