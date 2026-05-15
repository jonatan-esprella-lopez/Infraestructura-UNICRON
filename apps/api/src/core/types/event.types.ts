import type { DomainEvent } from './api.types.js';

export type DomainEventName =
  | 'lead.created'
  | 'lead.scored'
  | 'lead.intent.classified'
  | 'campaign.followup.scheduled'
  | 'qr.scanned'
  | 'campaign.mission.validated'
  | 'wallet.points.assigned'
  | 'notification.sent'
  | 'analytics.recorded';

export type AnyDomainEvent = DomainEvent<Record<string, unknown>>;
