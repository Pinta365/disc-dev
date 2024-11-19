import "@cross/env/load";
import { getEnv } from "@cross/env";

import { DiscordClient } from "../mod.ts";
import { DiscordEvents, GatewayIntents } from "../src/structures/gateway.ts";
import type { Message, TypingStart } from "../src/structures/messages.ts";

const token = getEnv("TOKEN2")!;

const intents = [
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILD_MODERATION,
    GatewayIntents.GUILD_EMOJIS_AND_STICKERS,
    GatewayIntents.GUILD_INTEGRATIONS,
    GatewayIntents.GUILD_WEBHOOKS,
    GatewayIntents.GUILD_INVITES,
    GatewayIntents.GUILD_VOICE_STATES,
    GatewayIntents.GUILD_PRESENCES,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_TYPING,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGE_TYPING,
    GatewayIntents.MESSAGE_CONTENT,
    GatewayIntents.GUILD_SCHEDULED_EVENTS,
    GatewayIntents.AUTO_MODERATION_CONFIGURATION,
    GatewayIntents.AUTO_MODERATION_EXECUTION,
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

client.on(DiscordEvents.TypingStart, (typingStart: TypingStart) => {
    console.log("TypingStart:", typingStart.member.user?.username);
});
