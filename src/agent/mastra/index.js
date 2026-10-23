import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { createSalesAgent } from './agents/sales_agent.js';
import { createPersonalAgent } from './agents/personal_agent.js';
import { createCustomerCareAgent } from './agents/customers-agent.js';
export const mastra = new Mastra({
    agents: { createSalesAgent, createPersonalAgent, createCustomerCareAgent },
    storage: new MastraCompositeStore({
        id: 'composite-storage',
        default: new LibSQLStore({
            id: "mastra-storage",
            url: process.env.TURSO_DATABASE_URL ?? "file:./mastra.db",
            authToken: process.env.TURSO_AUTH_TOKEN,
        }),
        domains: {
            observability: await new DuckDBStore().getStore('observability'),
        }
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