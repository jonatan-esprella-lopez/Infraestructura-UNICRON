import { createServer as createHttpServer, type Server } from 'node:http';
import { ApiApplication } from '../../app.js';
import { appConfig } from '../../core/config/app.config.js';
import type { AppServices } from '../../core/types/api.types.js';
import { bootstrapCache } from '../../bootstrap/bootstrap-cache.js';
import { bootstrapDatabase } from '../../bootstrap/bootstrap-database.js';
import { bootstrapEvents } from '../../bootstrap/bootstrap-events.js';
import { bootstrapMiddlewares } from '../../bootstrap/bootstrap-middlewares.js';
import { bootstrapQueue } from '../../bootstrap/bootstrap-queue.js';
import { bootstrapRoutes } from '../../bootstrap/bootstrap-routes.js';
import { bootstrapTurso } from '../../bootstrap/bootstrap-turso.js';
import { LoggerService } from '../../infrastructure/logger/logger.service.js';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service.js';
import { HealthcheckService } from '../../infrastructure/monitoring/healthcheck.service.js';
import { OpenAiProvider } from '../../providers/ai/openai.provider.js';
import { MailService } from '../../infrastructure/mail/mail.service.js';
import { StorageService } from '../../infrastructure/storage/storage.service.js';

export interface TestServer {
  baseUrl: string;
  close(): Promise<void>;
}

export async function startTestServer(port = 4001): Promise<TestServer> {
  const logger = new LoggerService({ ...appConfig, env: 'test' });
  const database = await bootstrapDatabase(logger);
  const cache = bootstrapCache(logger);
  const queue = bootstrapQueue(logger);
  const eventBus = bootstrapEvents(logger);
  const turso = await bootstrapTurso(logger);

  const services: AppServices = {
    ai: new OpenAiProvider(),
    cache,
    database,
    eventBus,
    logger,
    mail: new MailService(logger),
    metrics: new MetricsService(),
    queue,
    storage: new StorageService(logger),
    turso: turso ?? undefined,
    healthcheck: new HealthcheckService({ cache, database, queue }),
  };

  const testConfig = { ...appConfig, port };
  const app = new ApiApplication(testConfig, services);
  bootstrapMiddlewares(app, testConfig);
  bootstrapRoutes(app, testConfig, services);

  const server: Server = createHttpServer(app.handle);

  await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

  return {
    baseUrl: `http://127.0.0.1:${port}/api/v1`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

export async function apiPost(baseUrl: string, path: string, body: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() as Record<string, unknown> };
}

export async function apiGet(baseUrl: string, path: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { headers });
  return { status: res.status, body: await res.json() as Record<string, unknown> };
}
