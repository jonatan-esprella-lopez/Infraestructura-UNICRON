export const PROPERTY_PUBLISHED = 'proptech.property.published';

export interface PropertyPublishedPayload {
  propertyId: string;
  tenantId: string;
  title: string;
  city: string;
  zone?: string;
  price: number;
  currency: string;
}
