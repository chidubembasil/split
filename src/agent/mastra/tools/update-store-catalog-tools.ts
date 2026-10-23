import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StoreService } from "../../../store/store.service.js";

export function UpdateStoreFunction(
  store: StoreService,
  userId: string,
  storeId: string,
) {
  return createTool({
    id: "update-store",
    description:
      "Update the seller's store/business profile, such as its name, description, bank details, or rules.",

    inputSchema: z.object({
      name: z.string().optional().describe("The new store or business name"),
      description: z.string().optional().describe("The new business description"),
      accountName: z.string().optional().describe("Name on the business bank account"),
      accountNumber: z.string().optional().describe("Business bank account number"),
      bank: z.string().optional().describe("Bank where the business account is held"),
      rules: z
        .array(z.string())
        .optional()
        .describe("The new rules the agents must follow for this business"),
    }),

    execute: async ({ name, description, accountName, accountNumber, bank, rules }) => {
      const data = await store.updateStore(storeId, userId, {
        name,
        description,
        accountName,
        accountNumber,
        bank,
        rules,
      });

      return { success: true, store: data };
    },
  });
}
