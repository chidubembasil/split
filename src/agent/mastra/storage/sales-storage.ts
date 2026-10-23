import { PostgresStore } from "@mastra/pg"

export const storage = new PostgresStore({
    id: "sales-storage",
    connectionString: process.env.DATABASE_URL!,
    schemaName: "Sales-Schema"
})