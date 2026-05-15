import type { ScoringItem } from '../types/scoring.types';

export interface ScoringState {
  items: ScoringItem[];
  selectedId: string | null;
}

export const initialScoringState: ScoringState = {
  items: [],
  selectedId: null,
};
