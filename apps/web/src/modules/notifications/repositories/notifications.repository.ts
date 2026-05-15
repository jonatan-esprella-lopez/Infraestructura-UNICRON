import type { Repository } from '@core/interfaces/repository.interface';
import type { NotificationsItem } from '../types/notifications.types';

const seedItems: NotificationsItem[] = [
  { id: 'notifications-1', name: 'Notifications operativo', status: 'active', owner: 'Growth Team' },
  { id: 'notifications-2', name: 'Notifications discovery', status: 'draft', owner: 'Product Team' },
];

export const notificationsRepository: Repository<NotificationsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
