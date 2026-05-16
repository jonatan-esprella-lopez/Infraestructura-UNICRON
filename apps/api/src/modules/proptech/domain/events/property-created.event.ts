export const PROPERTY_CREATED = 'proptech.property.created';

export interface PropertyCreatedPayload {
  propertyId: string;
  tenantId: string;
  ownerId: string;
  title: string;
  operationType: string;
  propertyType: string;
}
