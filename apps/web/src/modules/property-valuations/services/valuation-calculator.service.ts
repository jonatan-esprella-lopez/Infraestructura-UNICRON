import type {
  LandValuationInput,
  LandValuationResult,
  ValuationFactorResult,
} from "../types/land-valuation.types";
import type { ZonePriceIndex } from "../types/zone-price.types";
import type { ComparableProperty } from "../types/land-valuation.types";
import { VALUATION_RULES } from "../constants/valuation-factor.constants";

export class ValuationCalculatorService {
  calculate(
    input: LandValuationInput,
    zonePrice: ZonePriceIndex,
    comparables: ComparableProperty[]
  ): LandValuationResult {
    const basePricePerM2 = zonePrice.priceAvgM2;
    const basePrice = input.surfaceM2 * basePricePerM2;

    const appliedFactors = this.calculateFactors(input, basePrice);
    const totalAdjustment = appliedFactors.reduce(
      (sum, factor) => sum + factor.impactAmount,
      0
    );

    const averagePrice = basePrice + totalAdjustment;

    const confidenceLevel = this.calculateConfidenceLevel(
      zonePrice.sampleCount,
      comparables.length
    );

    const margin = this.getMarginByConfidence(confidenceLevel);

    return {
      estimatedMinPrice: Math.round(averagePrice * (1 - margin)),
      estimatedAveragePrice: Math.round(averagePrice),
      estimatedMaxPrice: Math.round(averagePrice * (1 + margin)),
      estimatedPricePerM2: Math.round(averagePrice / input.surfaceM2),

      basePrice: Math.round(basePrice),
      basePricePerM2,

      currency: input.currency,
      confidenceLevel,

      appliedFactors,
      comparableProperties: comparables,

      summary: this.buildSummary(input, averagePrice, confidenceLevel),
      warnings: this.buildWarnings(input, confidenceLevel),
      generatedAt: new Date().toISOString(),
    };
  }

  private calculateFactors(
    input: LandValuationInput,
    basePrice: number
  ): ValuationFactorResult[] {
    return VALUATION_RULES.filter((rule) => rule.condition(input)).map(
      (rule) => {
        const impactAmount = basePrice * (rule.impactPercentage / 100);

        return {
          key: rule.key,
          label: rule.label,
          impactPercentage: rule.impactPercentage,
          impactAmount: Math.round(impactAmount),
          type: rule.type,
          reason: rule.reason,
        };
      }
    );
  }

  private calculateConfidenceLevel(
    sampleCount: number,
    comparableCount: number
  ): "low" | "medium" | "high" {
    const totalEvidence = sampleCount + comparableCount;

    if (totalEvidence >= 25) return "high";
    if (totalEvidence >= 8) return "medium";
    return "low";
  }

  private getMarginByConfidence(confidence: "low" | "medium" | "high"): number {
    if (confidence === "high") return 0.08;
    if (confidence === "medium") return 0.15;
    return 0.25;
  }

  private buildSummary(
    input: LandValuationInput,
    averagePrice: number,
    confidence: "low" | "medium" | "high"
  ): string {
    return `El terreno ubicado en ${input.zone}, ${input.municipality}, con una superficie de ${input.surfaceM2} m², tiene un valor comercial estimado promedio de ${Math.round(
      averagePrice
    )} ${input.currency}. Nivel de confianza: ${confidence}.`;
  }

  private buildWarnings(
    input: LandValuationInput,
    confidence: "low" | "medium" | "high"
  ): string[] {
    const warnings: string[] = [];

    if (confidence === "low") {
      warnings.push(
        "La estimación tiene baja confianza porque existen pocos datos comparables."
      );
    }

    if (input.legalStatus !== "complete_documents") {
      warnings.push(
        "El estado legal puede afectar el valor final del terreno."
      );
    }

    if (!input.hasSewerage) {
      warnings.push(
        "La falta de alcantarillado puede reducir el valor comercial."
      );
    }

    return warnings;
  }
}
