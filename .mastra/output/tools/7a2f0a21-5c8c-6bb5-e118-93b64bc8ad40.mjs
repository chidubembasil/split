import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

function CreateStoreFunction(store, userId) {
  return createTool({
    id: "create-store",
    description: "Create the seller's store/business profile. Use it only when the seller does not have a store yet.",
    inputSchema: z.object({
      name: z.string().describe("The store or business name"),
      description: z.string().describe("What the business sells"),
      accountName: z.string().describe("Name on the business bank account"),
      accountNumber: z.string().describe("Business bank account number"),
      bank: z.string().describe("Bank where the business account is held"),
      rules: z.array(z.string()).default([]).describe("Rules the agents must follow for this business")
    }),
    execute: async ({ name, description, accountName, accountNumber, bank, rules }) => {
      const data = await store.createStore(
        { name, description, accountName, accountNumber, bank, rules },
        userId
      );
      return { success: true, store: data };
    }
  });
}

export { CreateStoreFunction };
