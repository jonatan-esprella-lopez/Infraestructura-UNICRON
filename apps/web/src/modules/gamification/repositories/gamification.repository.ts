import type { Repository } from '@core/interfaces/repository.interface';
import type { GamificationItem } from '../types/gamification.types';

const seedItems: GamificationItem[] = [
  { id: 'gamification-1', name: 'Gamification operativo', status: 'active', owner: 'Growth Team' },
  { id: 'gamification-2', name: 'Gamification discovery', status: 'draft', owner: 'Product Team' },
];

export const gamificationRepository: Repository<GamificationItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
