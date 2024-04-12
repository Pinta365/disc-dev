import { makeAPIRequest } from "../rest.ts";
import type { Guild } from "../../structures/guilds.ts";

export async function getGuild(guildId: string, withCounts = false): Promise<Guild> {
    const queryParams = { with_counts: withCounts };
    return await makeAPIRequest("GET", `/guilds/${guildId}`, undefined, queryParams);
  }
  