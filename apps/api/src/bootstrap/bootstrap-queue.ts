import type { LoggerLike } from '../core/types/api.types.js';
import { QueueService } from '../infrastructure/queue/queue.service.js';

export function bootstrapQueue(logger: LoggerLike): QueueService {
  return new QueueService(logger);
}
