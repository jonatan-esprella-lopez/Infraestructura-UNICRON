import type { LandValuationInput } from "../types/land-valuation.types";

export interface ValuationRule {
  key: string;
  label: string;
  condition: (input: LandValuationInput) => boolean;
  impactPercentage: number;
  type: "positive" | "negative" | "neutral";
  reason: string;
}

export const VALUATION_RULES: ValuationRule[] = [
  {
    key: "corner_lot",
    label: "Terreno en esquina",
    condition: (input) => input.isCornerLot,
    impactPercentage: 5,
    type: "positive",
    reason:
      "Los terrenos en esquina suelen tener mayor exposición y potencial comercial.",
  },
  {
    key: "main_avenue",
    label: "Ubicación sobre avenida principal",
    condition: (input) => input.isOnMainAvenue,
    impactPercentage: 8,
    type: "positive",
    reason:
      "La cercanía o ubicación sobre avenida principal incrementa el valor comercial.",
  },
  {
    key: "complete_services",
    label: "Servicios básicos completos",
    condition: (input) =>
      input.hasWater &&
      input.hasElectricity &&
      input.hasSewerage &&
      input.hasGas,
    impactPercentage: 6,
    type: "positive",
    reason:
      "Los servicios completos aumentan la facilidad de construcción y habitabilidad.",
  },
  {
    key: "commercial_land_use",
    label: "Uso de suelo comercial",
    condition: (input) => input.landUseType === "commercial",
    impactPercentage: 10,
    type: "positive",
    reason:
      "El uso comercial puede elevar el potencial de rentabilidad del terreno.",
  },
  {
    key: "incomplete_documents",
    label: "Documentación incompleta",
    condition: (input) =>
      input.legalStatus === "incomplete" || input.legalStatus === "has_risk",
    impactPercentage: -12,
    type: "negative",
    reason:
      "Los riesgos o faltantes documentales reducen la confianza y el valor de mercado.",
  },
  {
    key: "documents_in_process",
    label: "Documentos en proceso",
    condition: (input) => input.legalStatus === "in_process",
    impactPercentage: -7,
    type: "negative",
    reason:
      "La documentación en proceso puede retrasar la venta o limitar financiamiento.",
  },
  {
    key: "no_sewerage",
    label: "Sin alcantarillado",
    condition: (input) => !input.hasSewerage,
    impactPercentage: -5,
    type: "negative",
    reason:
      "La falta de alcantarillado puede afectar la habitabilidad o el desarrollo del terreno.",
  },
  {
    key: "dirt_road",
    label: "Acceso por camino de tierra",
    condition: (input) => input.roadType === "dirt_road",
    impactPercentage: -6,
    type: "negative",
    reason:
      "El acceso no pavimentado puede reducir el valor frente a zonas consolidadas.",
  },
];
