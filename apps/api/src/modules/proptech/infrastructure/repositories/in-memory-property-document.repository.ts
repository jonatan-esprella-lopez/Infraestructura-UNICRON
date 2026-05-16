import type { PropertyDocument } from '../../domain/entities/property-document.entity.js';
import type { IPropertyDocumentRepository } from '../../domain/repositories/property-document.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyDocumentRepository implements IPropertyDocumentRepository {
  private store: Map<string, PropertyDocument> = new Map();

  async findByPropertyId(propertyId: string): Promise<PropertyDocument[]> {
    return Array.from(this.store.values()).filter((d) => d.propertyId === propertyId);
  }

  async findById(id: string): Promise<PropertyDocument | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertyDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyDocument> {
    const now = new Date();
    const doc: PropertyDocument = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(doc.id, doc);
    return doc;
  }

  async update(id: string, data: Partial<PropertyDocument>): Promise<PropertyDocument> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Document ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }

  async verify(id: string, verifiedBy: string): Promise<PropertyDocument> {
    return this.update(id, { status: 'verified', verifiedBy, verifiedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
