import "@cross/env/load";
import { getEnv } from "@cross/env";
import { DiscordRestClient } from "../mod.ts";

const appId = "1231947552979685448";
const guildId = "661300542160633867";

const rest = new DiscordRestClient(getEnv("TOKEN2")!);

const command = {
    name: "greet1",
    description: "sdsdfadfsd",
};

try {
    //const test = await rest.createGlobalCommand(appId, command);
    //const test = await rest.getGlobalCommands(appId, );
    //const test = await rest.deleteGlobalCommand(appId, "1308425760360497183");

    //const test = await rest.createGuildCommand(appId, guildId, command);
    const test = await rest.getGuildCommands(appId, guildId);
    //const test = await rest.deleteGuildCommand(appId, guildId, "1308425760360497183");

    //const test = await rest.editGuildCommand(appId, guildId, "1308497146953203733", command);

    //const test = await rest.bulkOverwriteGuildCommands(appId, guildId, [command]);

    console.log(test);
} catch (error) {
    console.error(error);
}
