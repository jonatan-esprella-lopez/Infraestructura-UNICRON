import type { EventHandler } from '../../../core/interfaces/event-handler.interface.js';
import type { DomainEvent, LoggerLike } from '../../../core/types/api.types.js';
import {
  PROPERTY_VISIT_SCHEDULED,
  type PropertyVisitScheduledPayload,
} from '../domain/events/property-visit-scheduled.event.js';

export function createPropertyVisitScheduledListener(logger: LoggerLike): EventHandler<PropertyVisitScheduledPayload> {
  return {
    eventName: PROPERTY_VISIT_SCHEDULED,
    handle: async (event: DomainEvent<PropertyVisitScheduledPayload>) => {
      logger.info('Visit scheduled — sending reminder notifications', {
        visitId: event.payload.visitId,
        propertyId: event.payload.propertyId,
        scheduledAt: event.payload.scheduledAt,
      });
    },
  };
}
