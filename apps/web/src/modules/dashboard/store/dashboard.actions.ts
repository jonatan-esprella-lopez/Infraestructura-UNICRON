import type { DashboardItem } from '../types/dashboard.types';

export const dashboardActions = {
  select(id: string) {
    return { type: 'dashboard/select', payload: id } as const;
  },
  hydrate(items: DashboardItem[]) {
    return { type: 'dashboard/hydrate', payload: items } as const;
  },
};
