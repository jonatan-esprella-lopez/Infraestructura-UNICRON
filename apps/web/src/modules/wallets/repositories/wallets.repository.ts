import type { Repository } from '@core/interfaces/repository.interface';
import type { WalletsItem } from '../types/wallets.types';

const seedItems: WalletsItem[] = [
  { id: 'wallets-1', name: 'Wallets operativo', status: 'active', owner: 'Growth Team' },
  { id: 'wallets-2', name: 'Wallets discovery', status: 'draft', owner: 'Product Team' },
];

export const walletsRepository: Repository<WalletsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
