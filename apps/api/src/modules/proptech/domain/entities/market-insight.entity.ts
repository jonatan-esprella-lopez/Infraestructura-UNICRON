export type InsightType = 'price_trend' | 'demand_index' | 'supply_index' | 'zone_ranking' | 'market_report';

export interface MarketInsight {
  id: string;
  tenantId: string;
  city: string;
  zone?: string;
  propertyType?: string;
  operationType?: string;
  insightType: InsightType;
  value: number;
  unit?: string;
  period: string;
  metadata?: Record<string, unknown>;
  generatedAt: Date;
  createdAt: Date;
}
