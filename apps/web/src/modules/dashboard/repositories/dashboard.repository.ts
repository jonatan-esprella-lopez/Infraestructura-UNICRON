import type { Repository } from '@core/interfaces/repository.interface';
import type { DashboardItem } from '../types/dashboard.types';

const seedItems: DashboardItem[] = [
  { id: 'dashboard-1', name: 'Dashboard operativo', status: 'active', owner: 'Growth Team' },
  { id: 'dashboard-2', name: 'Dashboard discovery', status: 'draft', owner: 'Product Team' },
];

export const dashboardRepository: Repository<DashboardItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
