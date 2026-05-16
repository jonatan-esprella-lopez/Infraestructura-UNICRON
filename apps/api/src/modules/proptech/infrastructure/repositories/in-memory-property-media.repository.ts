import type { PropertyMedia } from '../../domain/entities/property-media.entity.js';
import type { IPropertyMediaRepository } from '../../domain/repositories/property-media.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyMediaRepository implements IPropertyMediaRepository {
  private store: Map<string, PropertyMedia> = new Map();

  async findByPropertyId(propertyId: string): Promise<PropertyMedia[]> {
    return Array.from(this.store.values())
      .filter((m) => m.propertyId === propertyId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async findById(id: string): Promise<PropertyMedia | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertyMedia, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyMedia> {
    const now = new Date();
    const media: PropertyMedia = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(media.id, media);
    return media;
  }

  async reorder(propertyId: string, orderedIds: string[]): Promise<void> {
    orderedIds.forEach((id, index) => {
      const item = this.store.get(id);
      if (item && item.propertyId === propertyId) {
        this.store.set(id, { ...item, orderIndex: index, updatedAt: new Date() });
      }
    });
  }

  async setMain(id: string, propertyId: string): Promise<void> {
    for (const [key, item] of this.store.entries()) {
      if (item.propertyId === propertyId) {
        this.store.set(key, { ...item, isMain: item.id === id, updatedAt: new Date() });
      }
    }
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
