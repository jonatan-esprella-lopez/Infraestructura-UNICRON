import { EventName } from '../../../../core/enums/event.enum.js';
import type { DomainEvent, EventMetadata } from '../../../../core/types/api.types.js';
import { createDomainEvent } from '../../../../events/event-bus.js';

export interface LeadConvertedPayload {
  leadId: string;
  tenantId?: string;
}

export function leadConvertedEvent(payload: LeadConvertedPayload, metadata: EventMetadata): DomainEvent<LeadConvertedPayload> {
  return createDomainEvent('lead.converted', payload, metadata);
}

export const leadConvertedEventName = EventName.AnalyticsRecorded;
