export const PROPERTY_VISIT_SCHEDULED = 'proptech.property_visit.scheduled';

export interface PropertyVisitScheduledPayload {
  visitId: string;
  propertyId: string;
  clientId: string;
  agentId?: string;
  scheduledAt: string;
  visitType: string;
}
