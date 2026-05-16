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
  createdAt: Date;
  updatedAt: Date;
}
