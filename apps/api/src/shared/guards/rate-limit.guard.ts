import { AppError } from '../../core/errors/app.error.js';
import type { Middleware } from '../../core/types/api.types.js';

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function rateLimitGuard(options: RateLimitOptions): Middleware {
  const buckets = new Map<string, Bucket>();

  return (context, next) => {
    const key = context.req.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const current = buckets.get(key);
    const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + options.windowMs };

    bucket.count += 1;
    buckets.set(key, bucket);

    context.res.setHeader('x-rate-limit-limit', String(options.limit));
    context.res.setHeader('x-rate-limit-remaining', String(Math.max(options.limit - bucket.count, 0)));
    context.res.setHeader('x-rate-limit-reset', String(bucket.resetAt));

    if (bucket.count > options.limit) {
      throw new AppError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
    }

    return next();
  };
}
