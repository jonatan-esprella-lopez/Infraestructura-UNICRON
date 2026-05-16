import type { MarketplacesItem } from '../types/marketplaces.types';

export interface MarketplacesState {
  items: MarketplacesItem[];
  selectedId: string | null;
}

export const initialMarketplacesState: MarketplacesState = {
  items: [],
  selectedId: null,
};
