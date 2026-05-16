import type { PropertyVisit } from '../../domain/entities/property-visit.entity.js';
import type { IPropertyVisitRepository } from '../../domain/repositories/property-visit.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyVisitRepository implements IPropertyVisitRepository {
  private store: Map<string, PropertyVisit> = new Map();

  async findByPropertyId(propertyId: string): Promise<PropertyVisit[]> {
    return Array.from(this.store.values()).filter((v) => v.propertyId === propertyId);
  }

  async findByClientId(clientId: string): Promise<PropertyVisit[]> {
    return Array.from(this.store.values()).filter((v) => v.clientId === clientId);
  }

  async findById(id: string): Promise<PropertyVisit | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertyVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyVisit> {
    const now = new Date();
    const visit: PropertyVisit = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(visit.id, visit);
    return visit;
  }

  async update(id: string, data: Partial<PropertyVisit>): Promise<PropertyVisit> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Visit ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async findByAgentId(agentId: string): Promise<PropertyVisit[]> {
    return Array.from(this.store.values()).filter((v) => v.agentId === agentId);
  }

  async findAll(): Promise<PropertyVisit[]> {
    return Array.from(this.store.values()).sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
  }
}
