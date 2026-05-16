import type { AppConfig, Middleware } from '../../core/types/api.types.js';

export function corsMiddleware(config: AppConfig): Middleware {
  return (context, next) => {
    const origin = String(context.req.headers.origin ?? '');
    const allowedOrigin = config.corsOrigins.includes(origin) ? origin : config.corsOrigins[0] ?? '*';

    context.res.setHeader('access-control-allow-origin', allowedOrigin);
    context.res.setHeader('access-control-allow-headers', 'content-type, authorization, x-api-key, x-request-id, x-tenant-id');
    context.res.setHeader('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    context.res.setHeader('vary', 'origin');

    if (context.method === 'OPTIONS') {
      return { statusCode: 204, body: null };
    }

    return next();
  };
}
