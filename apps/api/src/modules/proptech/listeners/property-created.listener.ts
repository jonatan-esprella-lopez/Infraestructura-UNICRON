import type { EventHandler } from '../../../core/interfaces/event-handler.interface.js';
import type { DomainEvent, LoggerLike } from '../../../core/types/api.types.js';
import { PROPERTY_CREATED, type PropertyCreatedPayload } from '../domain/events/property-created.event.js';

export function createPropertyCreatedListener(logger: LoggerLike): EventHandler<PropertyCreatedPayload> {
  return {
    eventName: PROPERTY_CREATED,
    handle: async (event: DomainEvent<PropertyCreatedPayload>) => {
      logger.info('Property created — triggering onboarding workflow', {
        propertyId: event.payload.propertyId,
        tenantId: event.payload.tenantId,
      });
    },
  };
}
