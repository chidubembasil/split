import type { OrdersService } from '../../../order/order.service.js';
export declare function CreateOrderFunction(orders: OrdersService, storeId: string): import("@mastra/core/tools").Tool<{
    items: {
        productId: string;
        quantity: number;
    }[];
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    buyerConfirmed: true;
}, unknown, unknown, unknown, import("@mastra/core/tools").ToolExecutionContext<unknown, unknown, unknown>, "create-order", unknown>;
