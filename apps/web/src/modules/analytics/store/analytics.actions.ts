import type { AnalyticsItem } from '../types/analytics.types';

export const analyticsActions = {
  select(id: string) {
    return { type: 'analytics/select', payload: id } as const;
  },
  hydrate(items: AnalyticsItem[]) {
    return { type: 'analytics/hydrate', payload: items } as const;
  },
};
