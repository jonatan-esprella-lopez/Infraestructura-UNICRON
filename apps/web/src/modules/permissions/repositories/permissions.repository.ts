import type { Repository } from '@core/interfaces/repository.interface';
import type { PermissionsItem } from '../types/permissions.types';

const seedItems: PermissionsItem[] = [
  { id: 'permissions-1', name: 'Permissions operativo', status: 'active', owner: 'Growth Team' },
  { id: 'permissions-2', name: 'Permissions discovery', status: 'draft', owner: 'Product Team' },
];

export const permissionsRepository: Repository<PermissionsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
