import type { Middleware } from '../../core/types/api.types.js';

export const requestLoggerMiddleware: Middleware = async (context, next) => {
  const response = await next();
  const durationMs = Date.now() - context.startedAt;

  context.services.metrics.observe('http.request.duration_ms', durationMs, {
    method: context.method,
    path: context.path,
  });

  context.services.logger.info('Request completed', {
    durationMs,
    method: context.method,
    path: context.path,
    requestId: context.requestId,
    tenantId: context.tenantId,
  });

  return response;
};
