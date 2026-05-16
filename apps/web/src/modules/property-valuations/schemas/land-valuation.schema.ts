import { z } from "zod";

export const landValuationSchema = z.object({
  city: z.string().min(2, "La ciudad es obligatoria"),
  municipality: z.string().min(2, "El municipio es obligatorio"),
  zone: z.string().min(2, "La zona es obligatoria"),

  surfaceM2: z
    .number()
    .positive("La superficie debe ser mayor a 0")
    .max(1000000, "La superficie parece demasiado alta"),

  frontMeters: z.number().positive().optional(),
  depthMeters: z.number().positive().optional(),

  isCornerLot: z.boolean(),
  isOnMainAvenue: z.boolean(),

  roadType: z.enum([
    "main_avenue",
    "secondary_road",
    "dirt_road",
    "paved_street",
    "unknown",
  ]),

  landUseType: z.enum([
    "residential",
    "commercial",
    "mixed",
    "industrial",
    "agricultural",
    "unknown",
  ]),

  hasWater: z.boolean(),
  hasElectricity: z.boolean(),
  hasSewerage: z.boolean(),
  hasGas: z.boolean(),
  hasInternetAccess: z.boolean(),

  legalStatus: z.enum([
    "complete_documents",
    "in_process",
    "incomplete",
    "has_risk",
    "unknown",
  ]),

  hasFolioReal: z.boolean(),
  hasApprovedPlan: z.boolean(),
  taxesUpToDate: z.boolean(),

  latitude: z.number().optional(),
  longitude: z.number().optional(),

  requestedPrice: z.number().positive().optional(),
  currency: z.enum(["USD", "BOB"]),
});

export type LandValuationFormSchema = z.infer<typeof landValuationSchema>;
