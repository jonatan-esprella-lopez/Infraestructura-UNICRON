import type {
  LandValuationInput,
  LandValuationResult,
} from "../types/land-valuation.types";
import type { LandValuationRepository } from "../repositories/land-valuation.repository";

export class LandValuationService {
  constructor(private readonly repository: LandValuationRepository) {}

  async estimate(input: LandValuationInput): Promise<LandValuationResult> {
    this.validateInput(input);
    return this.repository.estimate(input);
  }

  private validateInput(input: LandValuationInput): void {
    if (!input.city.trim()) {
      throw new Error("La ciudad es obligatoria.");
    }

    if (!input.municipality.trim()) {
      throw new Error("El municipio es obligatorio.");
    }

    if (!input.zone.trim()) {
      throw new Error("La zona es obligatoria.");
    }

    if (input.surfaceM2 <= 0) {
      throw new Error("La superficie debe ser mayor a cero.");
    }
  }
}
