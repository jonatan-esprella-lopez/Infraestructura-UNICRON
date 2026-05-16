import { useMemo } from 'react';
import { NOTIFICATIONS_MODULE } from '../constants/notifications.constants';

export function useNotifications() {
  return useMemo(
    () => ({
      module: NOTIFICATIONS_MODULE,
      isReady: true,
    }),
    [],
  );
}
