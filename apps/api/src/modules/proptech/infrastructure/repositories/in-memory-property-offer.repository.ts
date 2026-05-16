import type { PropertyOffer } from '../../domain/entities/property-offer.entity.js';
import type { IPropertyOfferRepository } from '../../domain/repositories/property-offer.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyOfferRepository implements IPropertyOfferRepository {
  private store: Map<string, PropertyOffer> = new Map();

  async findByPropertyId(propertyId: string): Promise<PropertyOffer[]> {
    return Array.from(this.store.values()).filter((o) => o.propertyId === propertyId);
  }

  async findByClientId(clientId: string): Promise<PropertyOffer[]> {
    return Array.from(this.store.values()).filter((o) => o.clientId === clientId);
  }

  async findById(id: string): Promise<PropertyOffer | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertyOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyOffer> {
    const now = new Date();
    const offer: PropertyOffer = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(offer.id, offer);
    return offer;
  }

  async update(id: string, data: Partial<PropertyOffer>): Promise<PropertyOffer> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Offer ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }
}
