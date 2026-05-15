import type { CacheLike, DatabaseLike, HealthcheckLike, QueueLike } from '../../core/types/api.types.js';

interface HealthcheckDependencies {
  cache: CacheLike;
  database: DatabaseLike;
  queue: QueueLike;
}

export class HealthcheckService implements HealthcheckLike {
  constructor(private readonly dependencies: HealthcheckDependencies) {}

  async ready(): Promise<Record<string, unknown>> {
    const checks = this.checks();
    const ready = Object.values(checks).every(Boolean);

    return {
      checks,
      status: ready ? 'ready' : 'not_ready',
    };
  }

  async health(): Promise<Record<string, unknown>> {
    const readiness = await this.ready();

    return {
      ...readiness,
      timestamp: new Date().toISOString(),
    };
  }

  private checks(): Record<string, boolean> {
    return {
      cache: this.dependencies.cache.isReady(),
      database: this.dependencies.database.isReady(),
      queue: this.dependencies.queue.isReady(),
    };
  }
}
