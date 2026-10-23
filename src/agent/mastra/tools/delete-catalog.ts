import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { UploadService } from "../../../upload/upload.service.js";

export function DeleteCatalogFunction(catalog: UploadService) {
  return createTool({
    id: "catalog-tool",
    description: "Delete catalog data from the database",

    inputSchema: z.object({
      id: z.string().describe("Gets the data by ID"),
    }),

   

    execute: async ({ id }) => {
      const data = await catalog.remove(id);

     return `${data}, has been Deleted Successfully`
    },
  });
}