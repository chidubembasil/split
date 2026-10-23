import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

"use strict";
const Currency = {
  NAIRA: "NAIRA",
  DOLLAR: "DOLLAR",
  POUNDS: "POUNDS",
  EURO: "EURO",
  CANADIAN_DOLLAR: "CANADIAN_DOLLAR",
  CEDIS: "CEDIS"
};
const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
};

"use strict";
function ReadCatalogFunction(catalog) {
  return createTool({
    id: "catalog-tool",
    description: "Fetch catalog data from the database",
    inputSchema: z.object({
      id: z.string().describe("Gets the data by ID")
    }),
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.string(),
      currency: z.enum(Currency),
      fileUrl: z.url()
    }),
    execute: async ({ id }) => {
      const data = await catalog.findOne(id);
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        currency: data.currency,
        fileUrl: data.fileUrl
      };
    }
  });
}

export { ReadCatalogFunction };
