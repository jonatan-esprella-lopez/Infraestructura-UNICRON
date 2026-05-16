import type { GamificationItem } from '../types/gamification.types';

export interface GamificationState {
  items: GamificationItem[];
  selectedId: string | null;
}

export const initialGamificationState: GamificationState = {
  items: [],
  selectedId: null,
};
