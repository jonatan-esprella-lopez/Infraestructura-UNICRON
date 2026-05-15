import type { ApiApplication } from '../app.js';
import type { AppConfig } from '../core/types/api.types.js';
import { corsMiddleware } from '../shared/middlewares/cors.middleware.js';
import { requestLoggerMiddleware } from '../shared/middlewares/request-logger.middleware.js';
import { requestIdMiddleware } from '../shared/middlewares/request-id.middleware.js';
import { securityMiddleware } from '../shared/middlewares/security.middleware.js';
import { rateLimitGuard } from '../shared/guards/rate-limit.guard.js';

export function bootstrapMiddlewares(app: ApiApplication, config: AppConfig): void {
  app.use(requestIdMiddleware);
  app.use(securityMiddleware);
  app.use(corsMiddleware(config));
  app.use(rateLimitGuard({ limit: config.rateLimit.maxRequests, windowMs: config.rateLimit.windowMs }));
  app.use(requestLoggerMiddleware);
}
