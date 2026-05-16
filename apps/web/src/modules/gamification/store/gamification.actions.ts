import type { GamificationItem } from '../types/gamification.types';

export const gamificationActions = {
  select(id: string) {
    return { type: 'gamification/select', payload: id } as const;
  },
  hydrate(items: GamificationItem[]) {
    return { type: 'gamification/hydrate', payload: items } as const;
  },
};
