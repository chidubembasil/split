import { PostgresStore } from "@mastra/pg"

export const storage = new PostgresStore({
    id: "catalog-storage",
    connectionString: process.env.DATABASE_URL!,
    schemaName: "Catalog-Schema"
})