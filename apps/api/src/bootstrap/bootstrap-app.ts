import { ApiApplication } from '../app.js';
import { createServer } from '../server.js';
import { appConfig } from '../core/config/app.config.js';
import type { AppServices } from '../core/types/api.types.js';
import { bootstrapCache } from './bootstrap-cache.js';
import { bootstrapDatabase } from './bootstrap-database.js';
import { bootstrapEvents } from './bootstrap-events.js';
import { bootstrapMiddlewares } from './bootstrap-middlewares.js';
import { bootstrapQueue } from './bootstrap-queue.js';
import { bootstrapRoutes } from './bootstrap-routes.js';
import { bootstrapScheduler } from './bootstrap-scheduler.js';
import { bootstrapTurso } from './bootstrap-turso.js';
import { bootstrapWebsocket } from './bootstrap-websocket.js';
import { LoggerService } from '../infrastructure/logger/logger.service.js';
import { MetricsService } from '../infrastructure/monitoring/metrics.service.js';
import { HealthcheckService } from '../infrastructure/monitoring/healthcheck.service.js';
import { OpenAiProvider } from '../providers/ai/openai.provider.js';
import { MailService } from '../infrastructure/mail/mail.service.js';
import { StorageService } from '../infrastructure/storage/storage.service.js';

export async function bootstrapApp() {
  const logger = new LoggerService(appConfig);
  const database = await bootstrapDatabase(logger);
  const cache = bootstrapCache(logger);
  const queue = bootstrapQueue(logger);
  const eventBus = bootstrapEvents(logger);
  const metrics = new MetricsService();
  const ai = new OpenAiProvider();
  const mail = new MailService(logger);
  const storage = new StorageService(logger);
  const turso = await bootstrapTurso(logger);

  const services: AppServices = {
    ai,
    cache,
    database,
    eventBus,
    logger,
    mail,
    metrics,
    queue,
    storage,
    turso: turso ?? undefined,
    healthcheck: new HealthcheckService({ cache, database, queue }),
  };

  const app = new ApiApplication(appConfig, services);
  bootstrapMiddlewares(app, appConfig);
  bootstrapRoutes(app, appConfig, services);
  bootstrapWebsocket(services);
  bootstrapScheduler(services);

  return createServer(app, appConfig, logger);
}
