import type { Snowflake } from "./snowflake.ts";
import type { User } from "./users.ts";
import type { ChannelMention } from "./mentions.ts";
import type { Attachment } from "./attachments.ts";
import type { Embed } from "./embeds.ts";
import type { Reaction } from "./reactions.ts";
import type { GuildMember } from "./guilds.ts";
import type { Channel } from "./channels.ts";
import type { MessageStickerItem } from "./stickers.ts";
import type { Application } from "./applications.ts";
import type { Role, RoleSubscriptionData } from "./roles.ts";

export interface Message {
    id: Snowflake;
    channel_id: Snowflake;
    author: User;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: User[];
    mention_roles: string[];
    mention_channels?: ChannelMention[];
    attachments: Attachment[];
    embeds: Embed[];
    reactions?: Reaction[];
    nonce?: string;
    pinned: boolean;
    webhook_id?: Snowflake;
    type: number;
    activity?: MessageActivity;
    application?: Partial<Application>;
    application_id?: Snowflake;
    message_reference?: MessageReference;
    flags?: number;
    referenced_message?: Message;
    interaction_metadata?: MessageInteractionMetadata;
    interaction?: unknown; //DEPRECATED
    thread?: Channel;
    components?: ActionRow[];
    sticker_items?: MessageStickerItem[];
    stickers?: unknown; // DEPRECATED
    position?: number;
    role_subscription_data?: RoleSubscriptionData;
    resolved?: ResolvedData;
}

export interface MessageComponent {
    type: ComponentType;
    [key: string]: unknown; // TODO: create components for all ComponentTypes
}

export interface ActionRow extends MessageComponent {
    type: ComponentType.ACTION_ROW;
    components: MessageComponent[];
}

export enum ComponentType {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
    TEXT_INPUT = 4,
    USER_SELECT = 5,
    ROLE_SELECT = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT = 8,
}

export interface MessageActivity {
    type: MessageActivityType;
    party_id?: string;
}

export enum MessageActivityType {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5,
}

export interface MessageReference {
    message_id?: Snowflake;
    channel_id?: Snowflake;
    guild_id?: Snowflake;
    fail_if_not_exists?: boolean;
}

export interface MessageInteractionMetadata {
    id: Snowflake;
    type: InteractionType;
    user_id: Snowflake;
    authorizing_integration_owners: Record<IntegrationInstallContext, IntegrationOwner[]>;
    original_response_message_id?: Snowflake;
    interacted_message_id?: Snowflake;
    triggering_interaction_metadata?: MessageInteractionMetadata;
}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

export enum IntegrationInstallContext {
    GUILD_INSTALL = "0",
    USER_INSTALL = "1",
}

export type IntegrationOwner = Snowflake | "0";

export interface ResolvedData {
    users?: Map<Snowflake, User>;
    members?: Map<Snowflake, Partial<GuildMember>>;
    roles?: Map<Snowflake, Role>;
    channels?: Map<Snowflake, Partial<Channel>>;
    messages?: Map<Snowflake, Partial<Message>>;
    attachments?: Map<Snowflake, Attachment>;
}

/*
WATCH TOGETHER
{
  webhook_id: "880218394199220334",
  type: 23,
  tts: false,
  timestamp: "2024-04-12T07:53:29.905000+00:00",
  position: 0,
  pinned: false,
  nonce: "1228251633847107584",
  mentions: [],
  mention_roles: [],
  mention_everyone: false,
  interaction_metadata: {
    user_id: "213239148998426625",
    type: 2,
    name: "Watch Together",
    id: "1228251636296712213",
    authorizing_integration_owners: { "0": "661300542160633867" }
  },
  interaction: {
    user: {
      username: "pinta365",
      public_flags: 128,
      id: "213239148998426625",
      global_name: "PugHealer",
      discriminator: "0",
      clan: null,
      avatar_decoration_data: null,
      avatar: "bc42db22b409eaa10a752485a2d01337"
    },
    type: 2,
    name: "Watch Together",
    member: {
      roles: [],
      premium_since: null,
      pending: false,
      nick: "Pinta",
      mute: false,
      joined_at: "2019-12-30T20:12:15.627000+00:00",
      flags: 0,
      deaf: false,
      communication_disabled_until: null,
      avatar: null
    },
    id: "1228251636296712213"
  },
  id: "1228251636296712214",
  flags: 0,
  embeds: [],
  edited_timestamp: null,
  content: "",
  components: [],
  channel_id: "661300589359005746",
  author: {
    username: "Watch Together",
    public_flags: 65536,
    id: "880218394199220334",
    global_name: null,
    discriminator: "5319",
    clan: null,
    bot: true,
    avatar_decoration_data: null,
    avatar: "fe2b7fa334817b0346d57416ad75e93b"
  },
  attachments: [],
  application_id: "880218394199220334",
  application: {
    type: null,
    summary: "",
    name: "Watch Together",
    is_monetized: false,
    id: "880218394199220334",
    icon: "ec48acbad4c32efab4275cb9f3ca3a58",
    description: "Create and watch a playlist of YouTube videos with your friends. Your choice to share the remote or "... 5 more characters,
    cover_image: "3cc9446876ae9eec6e06ff565703c292",
    bot: {
      username: "Watch Together",
      public_flags: 65536,
      id: "880218394199220334",
      global_name: null,
      discriminator: "5319",
      clan: null,
      bot: true,
      banner_color: null,
      banner: null,
      avatar_decoration_data: null,
      avatar: "fe2b7fa334817b0346d57416ad75e93b",
      accent_color: null
    }
  },
  activity_instance: { id: "12e959d6-05f8-4942-8fed-d59e7ba4fea1" },
  guild_id: "661300542160633867"
}

POLL

Message create: {
  type: 0,
  tts: false,
  timestamp: "2024-04-12T07:50:41.842000+00:00",
  referenced_message: null,
  position: 0,
  poll: {
    results: null,
    question: { text: "test" },
    layout_type: 1,
    expiry: "2024-04-13T07:50:41.835741+00:00",
    answers: [
      { poll_media: { text: "1" }, answer_id: 1 },
      { poll_media: { text: "2" }, answer_id: 2 }
    ],
    allow_multiselect: false
  },
  pinned: false,
  nonce: "1228250929313087488",
  mentions: [],
  mention_roles: [],
  mention_everyone: false,
  member: {
    roles: [],
    premium_since: null,
    pending: false,
    nick: "Pinta",
    mute: false,
    joined_at: "2019-12-30T20:12:15.627000+00:00",
    flags: 0,
    deaf: false,
    communication_disabled_until: null,
    avatar: null
  },
  id: "1228250931389399130",
  flags: 0,
  embeds: [],
  edited_timestamp: null,
  content: "",
  components: [],
  channel_id: "661300589359005746",
  author: {
    username: "pinta365",
    public_flags: 128,
    id: "213239148998426625",
    global_name: "PugHealer",
    discriminator: "0",
    clan: null,
    avatar_decoration_data: null,
    avatar: "bc42db22b409eaa10a752485a2d01337"
  },
  attachments: [],
  guild_id: "661300542160633867"
}


{
  type: 0,
  tts: false,
  timestamp: "2024-04-11T18:04:32.288000+00:00",
  referenced_message: null,
  pinned: false,
  nonce: "1228043017286320128",
  mentions: [],
  mention_roles: [],
  mention_everyone: false,
  member: {
    roles: [],
    premium_since: null,
    pending: false,
    nick: "Pinta",
    mute: false,
    joined_at: "2019-12-30T20:12:15.627000+00:00",
    flags: 0,
    deaf: false,
    communication_disabled_until: null,
    avatar: null
  },
  id: "1228043021610778725",
  flags: 0,
  embeds: [],
  edited_timestamp: null,
  content: "fdfdfd",
  components: [],
  channel_id: "661300589359005746",
  author: {
    username: "pinta365",
    public_flags: 128,
    id: "213239148998426625",
    global_name: "PugHealer",
    discriminator: "0",
    clan: null,
    avatar_decoration_data: null,
    avatar: "bc42db22b409eaa10a752485a2d01337"
  },
  attachments: [],
  guild_id: "661300542160633867"
}
*/
