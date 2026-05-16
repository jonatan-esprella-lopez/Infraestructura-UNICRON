import { randomUUID } from 'node:crypto';
import type { DomainEvent, LoggerLike } from '../core/types/api.types.js';
import { emitter } from './emitter.js';

type EventHandler = (event: DomainEvent) => Promise<void> | void;

export class EventBus {
  constructor(private readonly logger: LoggerLike) {}

  subscribe<TPayload>(eventName: string, handler: (event: DomainEvent<TPayload>) => Promise<void> | void): void {
    emitter.on(eventName, (event: DomainEvent<TPayload>) => {
      void Promise.resolve(handler(event)).catch((error: unknown) => {
        this.logger.error('Event handler failed', {
          error: String(error),
          eventName,
        });
      });
    });
  }

  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    this.logger.debug('Event published', {
      eventId: event.id,
      eventName: event.name,
      tenantId: event.metadata.tenantId,
    });

    emitter.emit(event.name, event);
  }
}

export function createDomainEvent<TPayload>(
  name: string,
  payload: TPayload,
  metadata: DomainEvent['metadata'] = {},
): DomainEvent<TPayload> {
  return {
    id: randomUUID(),
    metadata,
    name,
    occurredAt: new Date().toISOString(),
    payload,
  };
}

export type { EventHandler };
