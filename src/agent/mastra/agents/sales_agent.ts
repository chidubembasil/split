import { Agent } from "@mastra/core/agent";
import type { OrdersService } from "../../../order/order.service.js";
import { SalesAgentInstructions } from "../instructions/sales_instructions.js";
import { CreateOrderFunction } from "../tools/order_tool.js";
import { salesMemory } from "../memory/sales-memory.js";



export function createSalesAgent(orders: OrdersService, storeId: string) {
    return new Agent({
        id: "sales_agent",
        name: "Sales Agent",
        description: "A sales agent that answers questions, qualifies the buyer (budget, date, size, location), recommends products, and negotiates within the seller’s rules",
        instructions: SalesAgentInstructions,
        tools: {
            orderTool: CreateOrderFunction(orders, storeId),
        },
        model: 'groq/openai/gpt-oss-120b',
        memory: salesMemory,
    })
}