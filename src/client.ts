// ./src/client.ts
import { Gateway } from "./gateway.ts";
import { DiscordEvents, type GatewayIntents, type GatewayPayload } from "./structures/gateway.ts";
import { DiscordRestClient } from "./rest_client.ts";
import { embelishInteraction } from "./embelish.ts";

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

        this.gateway = new Gateway(options.token, intents, this);
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

    handleDispatch(payload: GatewayPayload) {
        console.log("dispatch", payload.t);

        //Embelish some payloads..
        if (payload.t === DiscordEvents.InteractionCreate) {
            const embelishedInteraction = embelishInteraction(payload.d, this.rest);
            this.emit(payload.t as DiscordEvents, embelishedInteraction);
        } else {
            this.emit(payload.t as DiscordEvents, payload.d);
        }
    }

    botName(withDiscriminator: boolean = false): string {
        const botUser = this.gateway?.getBotUser();
        if (botUser) {
            if (withDiscriminator) {
                return botUser.username + "#" + botUser.discriminator;
            } else {
                return botUser.username;
            }
        } else {
            return "Unknown";
        }
    }

    closeSocket(code?: number, reason?: string): void {
        if (this.gateway) {
            this.gateway.close(code, reason);
        }
    }
}
