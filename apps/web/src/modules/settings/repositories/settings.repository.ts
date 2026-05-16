import type { Repository } from '@core/interfaces/repository.interface';
import type { SettingsItem } from '../types/settings.types';

const seedItems: SettingsItem[] = [
  { id: 'settings-1', name: 'Settings operativo', status: 'active', owner: 'Growth Team' },
  { id: 'settings-2', name: 'Settings discovery', status: 'draft', owner: 'Product Team' },
];

export const settingsRepository: Repository<SettingsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
