import { createTool } from "@mastra/core/tools";
import { z } from "zod";
export function UpdateCatalogFunction(catalog, userId, profileId, files = []) {
    return createTool({
        id: "catalog-tool",
        description: "Creates products ",
        inputSchema: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.string(),
            quantity: z.number()
        }),
        execute: async ({ id, name, description, price, quantity }) => {
            const dto = { name: [name], description, price: [price], quantity };
            const data = await catalog.update(id, dto, files, userId, profileId);
            return `${data}, has been Created Successfully`;
        },
    });
}
//# sourceMappingURL=update-catalog-tools.js.map