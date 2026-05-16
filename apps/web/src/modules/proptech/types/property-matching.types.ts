export interface MatchScoreBreakdown {
  budget: number;
  location: number;
  propertyType: number;
  bedrooms: number;
  urgency: number;
  legalStatus: number;
}

export interface PropertyMatch {
  id: string;
  clientId: string;
  propertyId: string;
  score: number;
  scoreBreakdown: MatchScoreBreakdown;
  matchReason?: string;
  riskFlags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientPreference {
  operationType?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  preferredCity?: string;
  preferredZones?: string[];
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  requiresParking?: boolean;
  purchaseIntention?: 'immediate' | 'within_3_months' | 'within_6_months' | 'exploratory';
  urgencyLevel?: 'high' | 'medium' | 'low';
  financingRequired?: boolean;
}

export interface MatchingResponse {
  clientId: string;
  totalMatches: number;
  matches: PropertyMatch[];
}
