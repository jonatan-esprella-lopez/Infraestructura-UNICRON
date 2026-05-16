import type { ConfidenceLevel, Currency } from "./land-valuation.types";

export interface ZonePriceIndex {
  id: string;
  city: string;
  municipality: string;
  zone: string;

  propertyType: "land";
  operationType: "sale";

  priceMinM2: number;
  priceAvgM2: number;
  priceMaxM2: number;

  currency: Currency;
  sampleCount: number;
  confidenceLevel: ConfidenceLevel;

  source: "manual" | "internal_data" | "external_market" | "mixed";
  calculatedAt: string;
  updatedAt: string;
}
