import { EventName } from '../../../../core/enums/event.enum.js';
import type { DomainEvent, EventMetadata } from '../../../../core/types/api.types.js';
import { createDomainEvent } from '../../../../events/event-bus.js';
import type { LeadSnapshot } from '../entities/lead.entity.js';

export function leadCreatedEvent(lead: LeadSnapshot, metadata: EventMetadata): DomainEvent<LeadSnapshot> {
  return createDomainEvent(EventName.LeadCreated, lead, metadata);
}
