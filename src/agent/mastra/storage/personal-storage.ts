import { PostgresStore } from "@mastra/pg"

export const storage = new PostgresStore({
    id: "personal-storage",
    connectionString: process.env.DATABASE_URL!,
    schemaName: "Personal-Schema"
})