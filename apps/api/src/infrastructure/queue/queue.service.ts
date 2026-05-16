import { randomUUID } from 'node:crypto';
import type { LoggerLike, QueueLike } from '../../core/types/api.types.js';
import type { QueueJob, QueueProcessor } from '../../core/types/queue.types.js';

export class QueueService implements QueueLike {
  private readonly processors = new Map<string, QueueProcessor[]>();

  constructor(private readonly logger: LoggerLike) {
    this.logger.info('Queue service initialized', { driver: process.env.REDIS_URL ? 'bullmq' : 'memory' });
  }

  register<TPayload>(queueName: string, processor: QueueProcessor<TPayload>): void {
    const processors = this.processors.get(queueName) ?? [];
    processors.push(processor as QueueProcessor);
    this.processors.set(queueName, processors);
  }

  async enqueue<TPayload>(queueName: string, payload: TPayload): Promise<void> {
    const job: QueueJob<TPayload> = {
      attempts: 0,
      id: randomUUID(),
      name: queueName,
      payload,
      queuedAt: new Date().toISOString(),
    };

    this.logger.info('Job enqueued', { id: job.id, queueName });

    for (const processor of this.processors.get(queueName) ?? []) {
      await processor(job as QueueJob);
    }
  }

  isReady(): boolean {
    return true;
  }
}
