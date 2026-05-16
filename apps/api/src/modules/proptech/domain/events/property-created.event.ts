export const PROPERTY_CREATED = 'proptech.property.created';

export interface PropertyCreatedPayload extends Record<string, unknown> {
  propertyId: string;
  tenantId: string;
  ownerId: string;
  title: string;
  operationType: string;
  propertyType: string;
}
