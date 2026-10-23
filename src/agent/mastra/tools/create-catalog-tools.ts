import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { UploadService } from "../../../upload/upload.service.js";

type UploadFiles = Parameters<UploadService["create"]>[1];

export function CreateCatalogFunction(catalog: UploadService,
    userId: string,
    profileId: string,
    files: UploadFiles = [],

) {
  return createTool({
    id: "catalog-tool",
    description: "Creates products ",

    inputSchema: z.object({
        name: z.string(),
        description: z.string(),
        price: z.string(),
        quantity: z.number()
    }),


    execute: async ({name, description, price, quantity  }) => {
        const dto = {name: [name], description, price: [price], quantity}
        const data = await catalog.create(dto, files, userId, profileId)
        return `${data}, has been Created Successfully`
    },
  });
}