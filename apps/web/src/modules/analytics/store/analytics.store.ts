import type { AnalyticsItem } from '../types/analytics.types';

export interface AnalyticsState {
  items: AnalyticsItem[];
  selectedId: string | null;
}

export const initialAnalyticsState: AnalyticsState = {
  items: [],
  selectedId: null,
};
