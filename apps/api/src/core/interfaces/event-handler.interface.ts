import type { DomainEvent } from '../types/api.types.js';

export interface EventHandler<TPayload = Record<string, unknown>> {
  eventName: string;
  handle(event: DomainEvent<TPayload>): Promise<void> | void;
}
