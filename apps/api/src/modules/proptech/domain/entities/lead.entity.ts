export type LeadStatus = 'new' | 'contacted' | 'interested' | 'visit_scheduled' | 'offer_sent' | 'converted' | 'lost';
export type LeadSource = 'manual' | 'website' | 'referral' | 'social_media' | 'portal' | 'phone';

export interface Lead {
  id: string;
  tenantId: string;
  agentId?: string;
<<<<<<< HEAD
  propertyId?: string;
  propertyTitle?: string;
=======
>>>>>>> origin/exp/pres
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  operationType?: string;
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  preferredCity?: string;
  notes?: string;
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadFilters {
  agentId?: string;
  status?: LeadStatus;
  tenantId?: string;
  limit?: number;
  offset?: number;
}
