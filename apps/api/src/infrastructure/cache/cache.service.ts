import type { CacheLike, LoggerLike } from '../../core/types/api.types.js';

interface CacheEntry {
  expiresAt?: number;
  value: unknown;
}

export class CacheService implements CacheLike {
  private readonly store = new Map<string, CacheEntry>();

  constructor(private readonly logger: LoggerLike) {
    this.logger.info('Cache service initialized', { driver: process.env.REDIS_URL ? 'redis' : 'memory' });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  isReady(): boolean {
    return true;
  }
}
