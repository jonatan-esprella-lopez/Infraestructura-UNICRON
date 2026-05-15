import type { MarketplacesItem } from '../types/marketplaces.types';

export const marketplacesActions = {
  select(id: string) {
    return { type: 'marketplaces/select', payload: id } as const;
  },
  hydrate(items: MarketplacesItem[]) {
    return { type: 'marketplaces/hydrate', payload: items } as const;
  },
};
