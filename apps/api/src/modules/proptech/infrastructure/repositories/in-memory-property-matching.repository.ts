import type { PropertyMatch } from '../../domain/entities/property-match.entity.js';
import type { IPropertyMatchingRepository } from '../../domain/repositories/property-matching.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyMatchingRepository implements IPropertyMatchingRepository {
  private store: Map<string, PropertyMatch> = new Map();

  async findAll(): Promise<PropertyMatch[]> {
    return Array.from(this.store.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByClientId(clientId: string): Promise<PropertyMatch[]> {
    return Array.from(this.store.values())
      .filter((m) => m.clientId === clientId)
      .sort((a, b) => b.score - a.score);
  }

  async findByPropertyId(propertyId: string): Promise<PropertyMatch[]> {
    return Array.from(this.store.values()).filter((m) => m.propertyId === propertyId);
  }

  async upsert(data: Omit<PropertyMatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyMatch> {
    const existing = Array.from(this.store.values()).find(
      (m) => m.clientId === data.clientId && m.propertyId === data.propertyId,
    );
    const now = new Date();
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: now };
      this.store.set(existing.id, updated);
      return updated;
    }
    const match: PropertyMatch = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(match.id, match);
    return match;
  }

  async deleteByClientId(clientId: string): Promise<void> {
    for (const [key, m] of this.store.entries()) {
      if (m.clientId === clientId) this.store.delete(key);
    }
  }
}
