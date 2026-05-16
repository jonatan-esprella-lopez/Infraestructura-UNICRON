import type { Middleware } from '../../core/types/api.types.js';

export const securityMiddleware: Middleware = (context, next) => {
  context.res.setHeader('x-content-type-options', 'nosniff');
  context.res.setHeader('x-frame-options', 'DENY');
  context.res.setHeader('referrer-policy', 'no-referrer');
  context.res.setHeader('content-security-policy', "default-src 'none'; frame-ancestors 'none'");
  return next();
};
