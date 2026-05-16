import type { PropertyContract } from '../entities/property-contract.entity.js';

export interface IPropertyContractRepository {
  findByPropertyId(propertyId: string): Promise<PropertyContract[]>;
  findById(id: string): Promise<PropertyContract | null>;
  create(data: Omit<PropertyContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyContract>;
  update(id: string, data: Partial<PropertyContract>): Promise<PropertyContract>;
}
