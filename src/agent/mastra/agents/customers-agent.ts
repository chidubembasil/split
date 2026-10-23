import { Agent } from "@mastra/core/agent";
import { CustomerCareInstruction } from "../instructions/customer_instruction.js";
import { createSalesAgent } from "./sales_agent.js";
import { OrdersService } from "../../../order/order.service.js";
import { customerMemory } from "../memory/customer-memory.js";

export function createCustomerCareAgent(orders: OrdersService, storeId: string) {
  return new Agent({
    id: "customer_care_agent",
    name: "Customer Care Agent",
    description: "Answers questions and resolves problems for customers, and hands buyers over to the Sales Agent.",
    instructions: CustomerCareInstruction,
    model: 'groq/openai/gpt-oss-120b',
    agents: { salesAgent: createSalesAgent(orders, storeId) },
    memory: customerMemory,
  });
}