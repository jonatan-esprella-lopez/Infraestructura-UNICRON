import type { PropertyContract } from '../../domain/entities/property-contract.entity.js';
import type { IPropertyContractRepository } from '../../domain/repositories/property-contract.repository.js';
import { randomUUID } from 'node:crypto';

export class InMemoryPropertyContractRepository implements IPropertyContractRepository {
  private store: Map<string, PropertyContract> = new Map();

  async findByPropertyId(propertyId: string): Promise<PropertyContract[]> {
    return Array.from(this.store.values()).filter((c) => c.propertyId === propertyId);
  }

  async findById(id: string): Promise<PropertyContract | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: Omit<PropertyContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyContract> {
    const now = new Date();
    const contract: PropertyContract = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(contract.id, contract);
    return contract;
  }

  async update(id: string, data: Partial<PropertyContract>): Promise<PropertyContract> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Contract ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.store.set(id, updated);
    return updated;
  }
}
