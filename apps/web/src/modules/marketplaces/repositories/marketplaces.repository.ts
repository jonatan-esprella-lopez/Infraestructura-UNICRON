import type { Repository } from '@core/interfaces/repository.interface';
import type { MarketplacesItem } from '../types/marketplaces.types';

const seedItems: MarketplacesItem[] = [
  { id: 'marketplaces-1', name: 'Marketplaces operativo', status: 'active', owner: 'Growth Team' },
  { id: 'marketplaces-2', name: 'Marketplaces discovery', status: 'draft', owner: 'Product Team' },
];

export const marketplacesRepository: Repository<MarketplacesItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
