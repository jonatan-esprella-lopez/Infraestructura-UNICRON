import { randomUUID } from 'node:crypto';
import type { Lead, LeadFilters } from '../../domain/entities/lead.entity.js';
import type { ILeadRepository } from '../../domain/repositories/lead.repository.js';

export class InMemoryLeadRepository implements ILeadRepository {
  private store: Map<string, Lead> = new Map();

  async findAll(filters: LeadFilters): Promise<{ items: Lead[]; total: number }> {
    let items = Array.from(this.store.values());

    if (filters.tenantId) items = items.filter((l) => l.tenantId === filters.tenantId);
    if (filters.agentId) items = items.filter((l) => l.agentId === filters.agentId);
    if (filters.status) items = items.filter((l) => l.status === filters.status);

    const total = items.length;
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 50;
    return { items: items.slice(offset, offset + limit), total };
  }

  async findById(id: string): Promise<Lead | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date();
    const lead: Lead = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(lead.id, lead);
    return lead;
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Lead ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
