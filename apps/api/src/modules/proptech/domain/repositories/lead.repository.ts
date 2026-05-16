import type { Lead, LeadFilters } from '../entities/lead.entity.js';

export interface ILeadRepository {
  findAll(filters: LeadFilters): Promise<{ items: Lead[]; total: number }>;
  findById(id: string): Promise<Lead | null>;
  create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead>;
  update(id: string, data: Partial<Lead>): Promise<Lead>;
  delete(id: string): Promise<void>;
}
