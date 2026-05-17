export type LeadStatus = 'new' | 'contacted' | 'interested' | 'visit_scheduled' | 'offer_sent' | 'converted' | 'lost';
export type LeadSource = 'manual' | 'website' | 'referral' | 'social_media' | 'portal' | 'phone';

export interface Lead {
  id: string;
  tenantId: string;
  agentId?: string;
  propertyId?: string;
  propertyTitle?: string;
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
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  agentId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateLeadPayload {
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
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  interested: 'Interesado',
  visit_scheduled: 'Visita agendada',
  offer_sent: 'Oferta enviada',
  converted: 'Convertido',
  lost: 'Perdido',
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  manual: 'Manual',
  website: 'Sitio web',
  referral: 'Referido',
  social_media: 'Redes sociales',
  portal: 'Portal',
  phone: 'Teléfono',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#3b82f6',
  contacted: '#8b5cf6',
  interested: '#f59e0b',
  visit_scheduled: '#06b6d4',
  offer_sent: '#f97316',
  converted: '#22c55e',
  lost: '#ef4444',
};
