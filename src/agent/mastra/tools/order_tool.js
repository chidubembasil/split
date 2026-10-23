import { HttpException } from '@nestjs/common';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
export function CreateOrderFunction(orders, storeId) {
    return createTool({
        id: 'create-order',
        description: "Take an order from a customer. Call it ONLY after you showed the customer the items, the delivery address and phone number, and the customer clearly said yes. Prices, the total, and stock are set by the system. Returns the saved order and the bank details the customer must pay to.",
        inputSchema: z.object({
            items: z
                .array(z.object({
                productId: z.string().describe('Product id from the catalog search. Never invent one.'),
                quantity: z.number().int().min(1).max(100),
            }))
                .min(1)
                .max(20),
            customerName: z.string().min(2).max(80).describe("The customer's name, as the customer gave it"),
            customerPhone: z.string().max(25).describe("The customer's phone number, as the customer gave it"),
            deliveryAddress: z.string().max(300).describe('Full delivery address, as the customer gave it'),
            buyerConfirmed: z.literal(true).describe('true only if the customer clearly said yes to the exact order summary'),
        }),
        execute: async ({ items, customerName, customerPhone, deliveryAddress }) => {
            try {
                return { ok: true, ...(await orders.createForStore(storeId, { items, customerName, customerPhone, deliveryAddress })) };
            }
            catch (e) {
                return { ok: false, reason: e instanceof HttpException ? e.message : 'Something went wrong. Please try again.' };
            }
        },
    });
}
//# sourceMappingURL=order_tool.js.map