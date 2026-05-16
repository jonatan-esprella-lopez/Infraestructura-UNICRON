import type { PropertyMedia } from '../entities/property-media.entity.js';

export interface IPropertyMediaRepository {
  findByPropertyId(propertyId: string): Promise<PropertyMedia[]>;
  findById(id: string): Promise<PropertyMedia | null>;
  create(data: Omit<PropertyMedia, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyMedia>;
  reorder(propertyId: string, orderedIds: string[]): Promise<void>;
  setMain(id: string, propertyId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
