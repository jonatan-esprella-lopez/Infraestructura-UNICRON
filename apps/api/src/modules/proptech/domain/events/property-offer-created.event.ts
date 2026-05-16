export const PROPERTY_OFFER_CREATED = 'proptech.property_offer.created';

export interface PropertyOfferCreatedPayload {
  offerId: string;
  propertyId: string;
  clientId: string;
  amount: number;
  currency: string;
}
