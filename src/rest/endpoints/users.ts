import { makeAPIRequest } from "../rest.ts";
import type { User } from "../../structures/users.ts";

export async function getMyUser(): Promise<User> {
    return await makeAPIRequest("GET", "/users/@me");
}
