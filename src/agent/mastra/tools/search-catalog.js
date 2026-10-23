import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Currency } from "../../../src/generated/prisma/enums.js";
export function SearchCatalogFunction(catalog) {
    return createTool({
        id: "catalog-tool",
        description: "Fetch catalog data from the database",
        inputSchema: z.object({
            name: z.string().describe("Gets the data by ID"),
        }),
        outputSchema: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.string(),
            currency: z.enum(Currency),
            fileUrl: z.url(),
        }),
        execute: async ({ name }) => {
            const data = await catalog.search(name);
            return {
                id: data.id,
                name: data.name,
                description: data.description,
                price: data.price.toString(),
                currency: data.currency,
                fileUrl: data.fileUrl,
            };
        },
    });
}
//# sourceMappingURL=search-catalog.js.map