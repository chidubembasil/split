import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { PostgresStore } from '@mastra/pg';
import {
  Observability,
  MastraStorageExporter,
  MastraPlatformExporter,
  SensitiveDataFilter,
} from '@mastra/observability';
import { createSalesAgent } from './agents/sales_agent.js';
import { createPersonalAgent } from './agents/personal_agent.js';
import { createCustomerCareAgent } from './agents/customers-agent.js';
import { OrdersService } from '../../order/order.service.js';

type PersonalAgentDependencies = Parameters<typeof createPersonalAgent>[0];

export function createMastra(deps: {
  orders: OrdersService;
  storeId: string;
  personal: PersonalAgentDependencies;
}) {
  return new Mastra({
    agents: {
      salesAgent: createSalesAgent(deps.orders, deps.storeId),
      personalAgent: createPersonalAgent(deps.personal),
      customerCareAgent: createCustomerCareAgent(deps.orders, deps.storeId),
    },
    storage: new PostgresStore({
      id: "mastra-storage",
      connectionString: process.env.DATABASE_URL,
    }),
    logger: new PinoLogger({
      name: 'Mastra',
      level: 'info',
    }),

    observability: new Observability({
      configs: {
        default: {
          serviceName: 'mastra',
          exporters: [
            new MastraStorageExporter(),
            new MastraPlatformExporter(),
          ],
          spanOutputProcessors: [
            new SensitiveDataFilter(),
          ],
        },
      },
    }),
  });
}