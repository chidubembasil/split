import { Agent } from "@mastra/core/agent";
import { OrdersService } from "../../../src/order/order.service.js";
export declare function createCustomerCareAgent(orders: OrdersService, storeId: string): Agent<"customer_care_agent", import("@mastra/core/agent").ToolsInput, undefined, any, import("@mastra/core/agent").AgentEditorConfig | undefined>;
