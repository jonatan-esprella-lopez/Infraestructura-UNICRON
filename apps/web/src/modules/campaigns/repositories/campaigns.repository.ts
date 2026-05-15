import type { Repository } from '@core/interfaces/repository.interface';
import type { CampaignsItem } from '../types/campaigns.types';

const seedItems: CampaignsItem[] = [
  { id: 'campaigns-1', name: 'Campaigns operativo', status: 'active', owner: 'Growth Team' },
  { id: 'campaigns-2', name: 'Campaigns discovery', status: 'draft', owner: 'Product Team' },
];

export const campaignsRepository: Repository<CampaignsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
