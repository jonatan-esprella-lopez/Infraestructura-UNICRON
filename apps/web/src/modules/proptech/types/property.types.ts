export type PropertyType = 'apartment' | 'house' | 'office' | 'land' | 'commercial' | 'warehouse' | 'parking';
export type OperationType = 'sale' | 'rent' | 'anticretico';
export type PropertyStatus = 'draft' | 'active' | 'paused' | 'sold' | 'rented' | 'archived';
export type PublicationStatus = 'unpublished' | 'pending_review' | 'published';
export type LegalStatus = 'clear' | 'in_process' | 'encumbered' | 'unknown';
export type Currency = 'USD' | 'BOB' | 'EUR';

export interface Property {
  id: string;
  tenantId: string;
  ownerId: string;
  agentId?: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  operationType: OperationType;
  status: PropertyStatus;
  publicationStatus: PublicationStatus;
  price: number;
  currency: Currency;
  areaTotal: number;
  areaBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floorNumber?: number;
  yearBuilt?: number;
  address: string;
  city: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
  legalStatus: LegalStatus;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListResponse {
  items: Property[];
  total: number;
}

export interface PropertyFilters {
  operationType?: OperationType;
  propertyType?: PropertyType;
  city?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  publicationStatus?: PublicationStatus;
  limit?: number;
  offset?: number;
}
