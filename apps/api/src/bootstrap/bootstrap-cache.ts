import type { LoggerLike } from '../core/types/api.types.js';
import { CacheService } from '../infrastructure/cache/cache.service.js';

export function bootstrapCache(logger: LoggerLike): CacheService {
  return new CacheService(logger);
}
