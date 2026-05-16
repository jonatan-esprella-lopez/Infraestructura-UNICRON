export type VisitStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type VisitType = 'in_person' | 'virtual';
export type VisitResult = 'interested' | 'not_interested' | 'pending_decision' | 'offer_made';

export interface PropertyVisit {
  id: string;
  propertyId: string;
  clientId: string;
  agentId?: string;
  scheduledAt: Date;
  status: VisitStatus;
  visitType: VisitType;
  notes?: string;
  clientFeedback?: string;
  agentFeedback?: string;
  result?: VisitResult;
  createdAt: Date;
  updatedAt: Date;
}
