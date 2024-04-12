import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";

//https://discord.com/developers/docs/resources/channel#reaction-object
export interface Reaction {
    count: number;
    count_details?: ReactionCountDetails;
    me: boolean;
    me_burst: boolean;
    emoji: Partial<Emoji>;
    burst_colors?: string[];
}

export interface ReactionCountDetails {
    burst?: number;
    normal: number;
}

export interface Emoji {
    id?: Snowflake;
    name?: string;
    roles?: Snowflake[];
    user?: User;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}
