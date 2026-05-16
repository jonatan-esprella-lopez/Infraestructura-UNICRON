export const PROPERTY_MATCH_CREATED = 'proptech.property_match.created';

export interface PropertyMatchCreatedPayload {
  matchId: string;
  clientId: string;
  propertyId: string;
  score: number;
}
