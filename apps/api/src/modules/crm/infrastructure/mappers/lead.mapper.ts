import type { LeadSnapshot } from '../../domain/entities/lead.entity.js';
import type { LeadModel } from '../persistence/lead.model.js';

export function toLeadModel(lead: LeadSnapshot): LeadModel {
  return {
    contact: lead.contact,
    createdAt: lead.createdAt,
    id: lead.id,
    score: lead.score,
    source: lead.source,
    status: lead.status,
    tenantId: lead.tenantId,
  };
}
