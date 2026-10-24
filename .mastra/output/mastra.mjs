import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { Observability, SensitiveDataFilter, MastraStorageExporter, MastraPlatformExporter } from '@mastra/observability';

const mastra = new Mastra({
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new MastraStorageExporter(),
          new MastraPlatformExporter()
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter()
        ]
      }
    }
  })
});

export { mastra as m };
