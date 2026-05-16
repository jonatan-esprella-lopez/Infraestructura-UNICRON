import type { PropertyOffer } from '../entities/property-offer.entity.js';

export interface IPropertyOfferRepository {
  findByPropertyId(propertyId: string): Promise<PropertyOffer[]>;
  findByClientId(clientId: string): Promise<PropertyOffer[]>;
  findById(id: string): Promise<PropertyOffer | null>;
  create(data: Omit<PropertyOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyOffer>;
  update(id: string, data: Partial<PropertyOffer>): Promise<PropertyOffer>;
}
