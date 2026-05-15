import type { Repository } from '@core/interfaces/repository.interface';
import type { AnalyticsItem } from '../types/analytics.types';

const seedItems: AnalyticsItem[] = [
  { id: 'analytics-1', name: 'Analytics operativo', status: 'active', owner: 'Growth Team' },
  { id: 'analytics-2', name: 'Analytics discovery', status: 'draft', owner: 'Product Team' },
];

export const analyticsRepository: Repository<AnalyticsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
