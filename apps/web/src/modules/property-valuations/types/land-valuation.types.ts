export type Currency = "USD" | "BOB";

export type ConfidenceLevel = "low" | "medium" | "high";

export type LandUseType =
  | "residential"
  | "commercial"
  | "mixed"
  | "industrial"
  | "agricultural"
  | "unknown";

export type RoadType =
  | "main_avenue"
  | "secondary_road"
  | "dirt_road"
  | "paved_street"
  | "unknown";

export type LegalStatus =
  | "complete_documents"
  | "in_process"
  | "incomplete"
  | "has_risk"
  | "unknown";

export interface LandValuationInput {
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  stateName?: string;
  city: string;
  municipality: string;
  zone: string;
  neighborhood?: string;

  surfaceM2: number;
  frontMeters?: number;
  depthMeters?: number;

  isCornerLot: boolean;
  isOnMainAvenue: boolean;
  roadType: RoadType;
  landUseType: LandUseType;

  hasWater: boolean;
  hasElectricity: boolean;
  hasSewerage: boolean;
  hasGas: boolean;
  hasInternetAccess: boolean;

  legalStatus: LegalStatus;
  hasFolioReal: boolean;
  hasApprovedPlan: boolean;
  taxesUpToDate: boolean;

  latitude?: number;
  longitude?: number;

  requestedPrice?: number;
  currency: Currency;
}

export interface LandValuationResult {
  estimatedMinPrice: number;
  estimatedAveragePrice: number;
  estimatedMaxPrice: number;
  estimatedPricePerM2: number;

  basePrice: number;
  basePricePerM2: number;

  currency: Currency;
  confidenceLevel: ConfidenceLevel;

  appliedFactors: ValuationFactorResult[];
  comparableProperties: ComparableProperty[];

  summary: string;
  warnings: string[];
  generatedAt: string;
}

export interface ValuationFactorResult {
  key: string;
  label: string;
  impactPercentage: number;
  impactAmount: number;
  type: "positive" | "negative" | "neutral";
  reason: string;
}

export interface ComparableProperty {
  id: string;
  title: string;
  zone: string;
  municipality: string;
  surfaceM2: number;
  price: number;
  pricePerM2: number;
  currency: Currency;
  distanceMeters?: number;
  similarityScore: number;
  source: "internal" | "manual" | "marketplace" | "external";
  url?: string;
}
