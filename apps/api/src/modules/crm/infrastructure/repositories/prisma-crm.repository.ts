import type { CrmRepository } from '../../domain/repositories/crm.repository.interface.js';
import type { Lead, LeadSnapshot } from '../../domain/entities/lead.entity.js';

export class PrismaCrmRepository implements CrmRepository {
  private readonly leads = new Map<string, Lead>();

  async findById(id: string): Promise<Lead | null> {
    return this.leads.get(id) ?? null;
  }

  async findAll(tenantId?: string): Promise<LeadSnapshot[]> {
    return [...this.leads.values()]
      .map((lead) => lead.toJSON())
      .filter((lead) => !tenantId || lead.tenantId === tenantId);
  }

  async save(entity: Lead): Promise<Lead> {
    this.leads.set(entity.id, entity);
    return entity;
  }
}
