import type { ScoringItem } from '../types/scoring.types';

export const scoringActions = {
  select(id: string) {
    return { type: 'scoring/select', payload: id } as const;
  },
  hydrate(items: ScoringItem[]) {
    return { type: 'scoring/hydrate', payload: items } as const;
  },
};
