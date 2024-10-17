import "server-only";
import{
    Account,
    Client,
    Databases,
    Models,
    Storage,
    type Account as AccountType,
    type Databases as DatabaseType,
    type Storage as StorageType,
    type Users as UserType,
} from "node-appwrite";

import { getCookie } from "hono/cookie";
import {createMiddleware} from "hono/factory";
import { AUTH_COOKIE } from "@/features/auth/constants";

type AddictionalContext = {
    Variables: {
        account: AccountType,
        databases: DatabaseType,
        storage: StorageType,
        users: UserType,
        user: Models.User<Models.Preferences>,
    }
}

export const sessionMiddleware = createMiddleware<AddictionalContext>(
    async(c , next) =>{
        const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

        const session = getCookie(c, AUTH_COOKIE);

        if(!session){
            return c.json({error: "Unauthorized"}, 401);
        }

        client.setSession(session);
        const account = new Account(client);
        const databases = new Databases(client);
        const storage = new Storage(client);

        const user = await account.get();

        c.set("account", account);
        c.set("databases", databases);
        c.set("storage", storage);
        c.set("user", user);

        await next();
    }
)