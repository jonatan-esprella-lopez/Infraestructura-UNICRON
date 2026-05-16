import type {
  LandValuationInput,
  LandValuationResult,
} from "../types/land-valuation.types";
import type { LandValuationRepository } from "./land-valuation.repository";
import { ValuationCalculatorService } from "../services/valuation-calculator.service";

export class MockLandValuationRepository implements LandValuationRepository {
  async estimate(input: LandValuationInput): Promise<LandValuationResult> {
    const calculator = new ValuationCalculatorService();

    const fakeZonePrice = {
      id: "zone-1",
      city: input.city,
      municipality: input.municipality,
      zone: input.zone,
      propertyType: "land" as const,
      operationType: "sale" as const,
      priceMinM2: 120,
      priceAvgM2: 160,
      priceMaxM2: 220,
      currency: input.currency,
      sampleCount: 12,
      confidenceLevel: "medium" as const,
      source: "manual" as const,
      calculatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const fakeComparables = [
      {
        id: "cmp-1",
        title: `Terreno comparable en ${input.zone}`,
        zone: input.zone,
        municipality: input.municipality,
        surfaceM2: input.surfaceM2 * 0.95,
        price: input.surfaceM2 * 155,
        pricePerM2: 155,
        currency: input.currency,
        distanceMeters: 850,
        similarityScore: 89,
        source: "manual" as const,
      },
      {
        id: "cmp-2",
        title: `Lote cercano en ${input.municipality}`,
        zone: input.zone,
        municipality: input.municipality,
        surfaceM2: input.surfaceM2 * 1.08,
        price: input.surfaceM2 * 172,
        pricePerM2: 172,
        currency: input.currency,
        distanceMeters: 1400,
        similarityScore: 82,
        source: "manual" as const,
      },
    ];

    await new Promise((resolve) => setTimeout(resolve, 700));

    return calculator.calculate(input, fakeZonePrice, fakeComparables);
  }
}
