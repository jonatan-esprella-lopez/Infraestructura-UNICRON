import type { Lead, LeadFilters } from '../../domain/entities/lead.entity.js';
import type { ILeadRepository } from '../../domain/repositories/lead.repository.js';

export class LeadService {
  constructor(private readonly repository: ILeadRepository) {}

  async findAll(filters: LeadFilters): Promise<{ items: Lead[]; total: number }> {
    return this.repository.findAll({ ...filters, limit: filters.limit ?? 50, offset: filters.offset ?? 0 });
  }

  async findById(id: string): Promise<Lead | null> {
    return this.repository.findById(id);
  }

  async create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    if (data.status === 'converted' && !data.convertedAt) {
      data.convertedAt = new Date();
    }
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
