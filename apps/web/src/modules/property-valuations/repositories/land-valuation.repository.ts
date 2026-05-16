import type {
  LandValuationInput,
  LandValuationResult,
} from "../types/land-valuation.types";

export interface LandValuationRepository {
  estimate(input: LandValuationInput): Promise<LandValuationResult>;
}

export class ApiLandValuationRepository implements LandValuationRepository {
  constructor(private readonly baseUrl: string) {}

  async estimate(input: LandValuationInput): Promise<LandValuationResult> {
    const response = await fetch(`${this.baseUrl}/api/proptech/valuations/land`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("No se pudo calcular la valuación del terreno.");
    }

    return response.json();
  }
}
