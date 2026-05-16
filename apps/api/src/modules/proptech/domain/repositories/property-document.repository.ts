import type { PropertyDocument } from '../entities/property-document.entity.js';

export interface IPropertyDocumentRepository {
  findByPropertyId(propertyId: string): Promise<PropertyDocument[]>;
  findById(id: string): Promise<PropertyDocument | null>;
  create(data: Omit<PropertyDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyDocument>;
  update(id: string, data: Partial<PropertyDocument>): Promise<PropertyDocument>;
  verify(id: string, verifiedBy: string): Promise<PropertyDocument>;
  delete(id: string): Promise<void>;
}
