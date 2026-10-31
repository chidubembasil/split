import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js"; // your prisma client instance

export const auth = betterAuth({
    emailAndPassword: {    
        enabled: true
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    console.log("DEBUG user create payload:", JSON.stringify(user));
                    return { data: user };
                },
            },
        },
    },
});