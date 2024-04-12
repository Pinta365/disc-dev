import { Gateway } from "./gateway/gateway.ts";
import type { GatewayIntents } from "./structures/gateway.ts";
import type { DiscordEvents } from "./constants.ts";

interface ClientOptions {
    token: string;
    intents?: GatewayIntents[];
}

export class DiscordClient {
    gateway: Gateway;

    constructor(options: ClientOptions) {
        const intents = options.intents || [];
        this.gateway = new Gateway(options.token, intents);
    }

    // deno-lint-ignore no-explicit-any
    on(event: DiscordEvents, callback: (...args: any[]) => void) {
        this.gateway.on(event, callback);
    }

    closeSocket(code?: number, reason?: string) {
        this.gateway.close(code, reason);
    }
}
