import type { NotificationsItem } from '../types/notifications.types';

export const notificationsActions = {
  select(id: string) {
    return { type: 'notifications/select', payload: id } as const;
  },
  hydrate(items: NotificationsItem[]) {
    return { type: 'notifications/hydrate', payload: items } as const;
  },
};
