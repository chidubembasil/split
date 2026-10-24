import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { createSalesAgent } from './agents/sales_agent.js';
import { createPersonalAgent } from './agents/personal_agent.js';
import { createCustomerCareAgent } from './agents/customers-agent.js';
import { PostgresStore } from '@mastra/pg';


export const mastra = new Mastra({
    agents: { createSalesAgent, createPersonalAgent, createCustomerCareAgent },
    
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
//# sourceMappingURL=index.js.map