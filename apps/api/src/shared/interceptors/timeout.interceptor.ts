import { AppError } from '../../core/errors/app.error.js';
import type { Middleware } from '../../core/types/api.types.js';

export function timeoutInterceptor(timeoutMs: number): Middleware {
  return async (_context, next) => {
    return Promise.race([
      next(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new AppError('Request timed out', 408, 'REQUEST_TIMEOUT')), timeoutMs);
      }),
    ]);
  };
}
