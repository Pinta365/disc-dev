import { getMyUser } from "../src/rest/endpoints/users.ts";
import { getGuild } from "../src/rest/endpoints/guilds.ts";

const g = await getMyUser();
console.log(g.username);

const g2 = await getGuild("661300542160633867");
console.log(g2.name);
