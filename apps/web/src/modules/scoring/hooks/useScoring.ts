import { useMemo } from 'react';
import { SCORING_MODULE } from '../constants/scoring.constants';

export function useScoring() {
  return useMemo(
    () => ({
      module: SCORING_MODULE,
      isReady: true,
    }),
    [],
  );
}
