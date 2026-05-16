import type { LoggerLike } from '../core/types/api.types.js';
import { EventBus } from '../events/event-bus.js';

export function bootstrapEvents(logger: LoggerLike): EventBus {
  return new EventBus(logger);
}
