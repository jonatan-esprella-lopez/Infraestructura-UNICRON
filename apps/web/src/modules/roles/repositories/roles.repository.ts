import type { Repository } from '@core/interfaces/repository.interface';
import type { RolesItem } from '../types/roles.types';

const seedItems: RolesItem[] = [
  { id: 'roles-1', name: 'Roles operativo', status: 'active', owner: 'Growth Team' },
  { id: 'roles-2', name: 'Roles discovery', status: 'draft', owner: 'Product Team' },
];

export const rolesRepository: Repository<RolesItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
