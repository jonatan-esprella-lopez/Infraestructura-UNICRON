import type { MarketInsight } from '../entities/market-insight.entity.js';

export interface IMarketInsightRepository {
  findAll(filters: { tenantId: string; city?: string; zone?: string; propertyType?: string }): Promise<MarketInsight[]>;
  findById(id: string): Promise<MarketInsight | null>;
  create(data: Omit<MarketInsight, 'id' | 'createdAt'>): Promise<MarketInsight>;
}
