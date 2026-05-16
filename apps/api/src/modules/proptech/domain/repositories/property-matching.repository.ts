import type { PropertyMatch } from '../entities/property-match.entity.js';

export interface IPropertyMatchingRepository {
  findByClientId(clientId: string): Promise<PropertyMatch[]>;
  findByPropertyId(propertyId: string): Promise<PropertyMatch[]>;
  upsert(data: Omit<PropertyMatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyMatch>;
  deleteByClientId(clientId: string): Promise<void>;
}
