import type { NotificationsItem } from '../types/notifications.types';

export interface NotificationsState {
  items: NotificationsItem[];
  selectedId: string | null;
}

export const initialNotificationsState: NotificationsState = {
  items: [],
  selectedId: null,
};
