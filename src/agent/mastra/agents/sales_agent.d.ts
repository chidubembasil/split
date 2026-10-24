import { Agent } from "@mastra/core/agent";
import type { OrdersService } from "../../../order/order.service.js";
export declare function createSalesAgent(orders: OrdersService, storeId: string): Agent<"sales_agent", {
    orderTool: import("@mastra/core/tools").Tool<{
        items: {
            productId: string;
            quantity: number;
        }[];
        customerName: string;
        customerPhone: string;
        deliveryAddress: string;
        buyerConfirmed: true;
    }, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "create-order", unknown>;
}, undefined, any, import("@mastra/core/agent").AgentEditorConfig | undefined>;
