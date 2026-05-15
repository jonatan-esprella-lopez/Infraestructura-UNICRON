import type { ContactValue } from '../../domain/value-objects/contact.vo.js';
import type { LeadStatus } from '../../domain/entities/lead.entity.js';

export interface LeadModel {
  contact: ContactValue;
  createdAt: string;
  id: string;
  score: number;
  source: string;
  status: LeadStatus;
  tenantId?: string;
}
