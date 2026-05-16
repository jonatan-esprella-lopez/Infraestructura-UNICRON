import type { Repository } from '@core/interfaces/repository.interface';
import type { UsersItem } from '../types/users.types';

const seedItems: UsersItem[] = [
  { id: 'users-1', name: 'Users operativo', status: 'active', owner: 'Growth Team' },
  { id: 'users-2', name: 'Users discovery', status: 'draft', owner: 'Product Team' },
];

export const usersRepository: Repository<UsersItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
