import type { Property } from '../../domain/entities/property.entity.js';
import type { IPropertyRepository, PropertyFilters } from '../../domain/repositories/property.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyRepository implements IPropertyRepository {
  private store: Map<string, Property> = new Map();

  async findById(id: string): Promise<Property | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(filters: PropertyFilters): Promise<{ items: Property[]; total: number }> {
    let items = Array.from(this.store.values()).filter((p) => !p.deletedAt);

    if (filters.tenantId) items = items.filter((p) => p.tenantId === filters.tenantId);
    if (filters.operationType) items = items.filter((p) => p.operationType === filters.operationType);
    if (filters.propertyType) items = items.filter((p) => p.propertyType === filters.propertyType);
    if (filters.city) items = items.filter((p) => p.city === filters.city);
    if (filters.zone) items = items.filter((p) => p.zone === filters.zone);
    if (filters.minPrice !== undefined) items = items.filter((p) => p.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) items = items.filter((p) => p.price <= filters.maxPrice!);
    if (filters.minBedrooms !== undefined) items = items.filter((p) => (p.bedrooms ?? 0) >= filters.minBedrooms!);
    if (filters.publicationStatus) items = items.filter((p) => p.publicationStatus === filters.publicationStatus);
    if (filters.status) items = items.filter((p) => p.status === filters.status);
    if (filters.agentId) items = items.filter((p) => p.agentId === filters.agentId);

    const total = items.length;
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 20;
    return { items: items.slice(offset, offset + limit), total };
  }

  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const now = new Date();
    const property: Property = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(property.id, property);
    return property;
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Property ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const existing = this.store.get(id);
    if (existing) this.store.set(id, { ...existing, deletedAt: new Date(), updatedAt: new Date() });
  }

  async publish(id: string): Promise<Property> {
    return this.update(id, { publicationStatus: 'published', publishedAt: new Date(), status: 'active' });
  }

  async unpublish(id: string): Promise<Property> {
    return this.update(id, { publicationStatus: 'unpublished' });
  }

  async archive(id: string): Promise<Property> {
    return this.update(id, { status: 'archived', publicationStatus: 'unpublished' });
  }
}
