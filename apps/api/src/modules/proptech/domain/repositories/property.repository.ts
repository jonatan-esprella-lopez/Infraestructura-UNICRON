import type { Property } from '../entities/property.entity.js';

export interface PropertyFilters {
  tenantId?: string;
  operationType?: string;
  propertyType?: string;
  city?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  publicationStatus?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface IPropertyRepository {
  findById(id: string): Promise<Property | null>;
  findAll(filters: PropertyFilters): Promise<{ items: Property[]; total: number }>;
  create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>;
  update(id: string, data: Partial<Property>): Promise<Property>;
  softDelete(id: string): Promise<void>;
  publish(id: string): Promise<Property>;
  unpublish(id: string): Promise<Property>;
  archive(id: string): Promise<Property>;
}
