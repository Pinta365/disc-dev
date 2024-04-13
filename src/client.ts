//client.ts
import { Gateway } from "./gateway/gateway.ts";
import type { GatewayIntents } from "./structures/gateway.ts";
import type { DiscordEvents } from "./constants.ts";

interface ClientOptions {
    token: string;
    intents?: GatewayIntents[];
}

export class DiscordClient {
    gateway: Gateway | null = null;

    constructor(options: ClientOptions) {
        const intents = options.intents || [];


        this.fetchGatewayUrl(options.token).then((gatewayData) => {            
            /*
            gatewayData {
                url: "wss://gateway.discord.gg",
                session_start_limit: {
                    max_concurrency: 1,
                    remaining: 984,
                    reset_after: 3440842,
                    total: 1000
                },
                shards: 1
                }
            */

            //We can also enable the ability to choose other encoding and/or compression
            //https://discord.com/developers/docs/topics/gateway#connecting-gateway-url-query-string-params
            const gatewayUrl = `${gatewayData.url}?/v=10&encoding=json`;
            this.gateway = new Gateway(options.token, intents, gatewayUrl);
        }).catch((error) => {
            console.error("Error fetching Gateway URL:", error);
            // Handle the error appropriately 
        });

    }

    async fetchGatewayUrl(token: string) {
        const response = await fetch('https://discord.com/api/v10/gateway/bot', {
            headers: { 'Authorization': `Bot ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Gateway URL - Status: ${response.status}`);
        }

        return await response.json();
    }

    // deno-lint-ignore no-explicit-any
    on(event: DiscordEvents, callback: (...args: any[]) => void): void {
        if(this.gateway)
            this.gateway.on(event, callback);
    }

    closeSocket(code?: number, reason?: string): void {
        if(this.gateway)
            this.gateway.close(code, reason);
    }
}
