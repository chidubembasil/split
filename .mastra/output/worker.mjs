import { timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { m as mastra } from './mastra.mjs';
import '@mastra/core/mastra';
import '@mastra/loggers';
import '@mastra/observability';

const workerConfigToken = process.env.MASTRA_WORKER_CONFIG_TOKEN;
    let workersReady = false;
    let shuttingDown = false;

    const isWorkerConfigRequestAuthorized = request => {
      const authorization = request.headers.authorization;
      if (!workerConfigToken || !authorization?.startsWith('Bearer ')) return false;
      const providedToken = Buffer.from(authorization.slice('Bearer '.length));
      const expectedToken = Buffer.from(workerConfigToken);
      return providedToken.length === expectedToken.length && timingSafeEqual(providedToken, expectedToken);
    };

    const healthServer = createServer((request, response) => {
      response.setHeader('content-type', 'application/json');

      if (request.url === '/config') {
        if (!isWorkerConfigRequestAuthorized(request)) {
          response.statusCode = 401;
          response.end(JSON.stringify({ status: 'unauthorized' }));
          return;
        }
        response.statusCode = 200;
        response.end(JSON.stringify(mastra.getWorkerConfig()));
        return;
      }

      if (request.url !== '/health') {
        response.statusCode = 404;
        response.end(JSON.stringify({ status: 'not_found' }));
        return;
      }

      response.statusCode = workersReady ? 200 : 503;
      response.end(JSON.stringify({ status: workersReady ? 'ready' : 'starting' }));
    });

    const port = Number.parseInt(process.env.PORT ?? '4111', 10);
    await new Promise((resolve, reject) => {
      const onError = error => reject(error);
      healthServer.once('error', onError);
      healthServer.listen(port, '0.0.0.0', () => {
        healthServer.off('error', onError);
        resolve();
      });
    });

    try {
      await mastra.startWorkers();
      workersReady = true;
      console.log('[mastra] Workers started');
    } catch (error) {
      healthServer.close();
      throw error;
    }

    const shutdown = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      workersReady = false;
      console.log('[mastra] Shutting down workers...');
      healthServer.close();
      await mastra.stopWorkers();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
