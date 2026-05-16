import type { Middleware } from '../../core/types/api.types.js';

export const loggerInterceptor: Middleware = async (context, next) => {
  const response = await next();
  context.services.logger.debug('Response completed', {
    durationMs: Date.now() - context.startedAt,
    path: context.path,
    requestId: context.requestId,
  });
  return response;
};
