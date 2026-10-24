import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { PostgresStore } from '@mastra/pg';
import { Observability, SensitiveDataFilter, MastraStorageExporter, MastraPlatformExporter } from '@mastra/observability';

"use strict";
const mastra = new Mastra({
  storage: new PostgresStore({
    id: "mastra-storage",
    connectionString: process.env.DATABASE_URL
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [new MastraStorageExporter(), new MastraPlatformExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()]
      }
    }
  })
});

export { mastra };
