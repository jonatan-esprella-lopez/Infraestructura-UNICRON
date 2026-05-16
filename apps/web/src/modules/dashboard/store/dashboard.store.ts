import type { DashboardItem } from '../types/dashboard.types';

export interface DashboardState {
  items: DashboardItem[];
  selectedId: string | null;
}

export const initialDashboardState: DashboardState = {
  items: [],
  selectedId: null,
};
