import { createTool } from "@mastra/core/tools";
import { z } from "zod";
export function CreateCatalogFunction(catalog, userId, profileId, files = []) {
    return createTool({
        id: "catalog-tool",
        description: "Creates products ",
        inputSchema: z.object({
            name: z.string(),
            description: z.string(),
            price: z.string(),
            quantity: z.number()
        }),
        execute: async ({ name, description, price, quantity }) => {
            const dto = { name: [name], description, price: [price], quantity };
            const data = await catalog.create(dto, files, userId, profileId);
            return `${data}, has been Created Successfully`;
        },
    });
}
//# sourceMappingURL=create-catalog-tools.js.map