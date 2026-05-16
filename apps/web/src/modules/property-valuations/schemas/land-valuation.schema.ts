import type { LandValuationInput } from "../types/land-valuation.types";

const ROAD_TYPES = [
  "main_avenue",
  "secondary_road",
  "dirt_road",
  "paved_street",
  "unknown",
] as const;

const LAND_USE_TYPES = [
  "residential",
  "commercial",
  "mixed",
  "industrial",
  "agricultural",
  "unknown",
] as const;

const LEGAL_STATUSES = [
  "complete_documents",
  "in_process",
  "incomplete",
  "has_risk",
  "unknown",
] as const;

export const landValuationSchema = {
  validate(input: LandValuationInput): string[] {
    const errors: string[] = [];

    if (input.city.trim().length < 2) errors.push("La ciudad es obligatoria");
    if (input.municipality.trim().length < 2) errors.push("El municipio es obligatorio");
    if (input.zone.trim().length < 2) errors.push("La zona es obligatoria");
    if (input.surfaceM2 <= 0) errors.push("La superficie debe ser mayor a 0");
    if (input.surfaceM2 > 1000000) errors.push("La superficie parece demasiado alta");
    if (input.frontMeters !== undefined && input.frontMeters <= 0) errors.push("El frente debe ser mayor a 0");
    if (input.depthMeters !== undefined && input.depthMeters <= 0) errors.push("El fondo debe ser mayor a 0");
    if (!ROAD_TYPES.includes(input.roadType)) errors.push("Tipo de via no valido");
    if (!LAND_USE_TYPES.includes(input.landUseType)) errors.push("Uso de suelo no valido");
    if (!LEGAL_STATUSES.includes(input.legalStatus)) errors.push("Estado legal no valido");
    if (input.requestedPrice !== undefined && input.requestedPrice <= 0) errors.push("El precio solicitado debe ser mayor a 0");
    if (input.currency !== "USD" && input.currency !== "BOB") errors.push("Moneda no valida");

    return errors;
  },
};

export type LandValuationFormSchema = LandValuationInput;
