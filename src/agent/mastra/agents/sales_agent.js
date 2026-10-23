import { Agent } from "@mastra/core/agent";
import { SalesAgentInstructions } from "../instructions/sales_instructions.js";
import { CreateOrderFunction } from "../tools/order_tool.js";
export function createSalesAgent(orders, storeId) {
    return new Agent({
        id: "sales_agent",
        name: "Sales Agent",
        description: "A sales agent that answers questions, qualifies the buyer (budget, date, size, location), recommends products, and negotiates within the seller’s rules",
        instructions: SalesAgentInstructions,
        tools: {
            orderTool: CreateOrderFunction(orders, storeId),
        },
        model: 'groq/openai/gpt-oss-120b',
    });
}
//# sourceMappingURL=sales_agent.js.map