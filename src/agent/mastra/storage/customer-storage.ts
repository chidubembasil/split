import { PostgresStore } from "@mastra/pg"

export const storage = new PostgresStore({
    id: "customer-storage",
    connectionString: process.env.DATABASE_URL!,
    schemaName: "Customer-Schema"
})