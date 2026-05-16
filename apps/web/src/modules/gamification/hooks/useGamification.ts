import { useMemo } from 'react';
import { GAMIFICATION_MODULE } from '../constants/gamification.constants';

export function useGamification() {
  return useMemo(
    () => ({
      module: GAMIFICATION_MODULE,
      isReady: true,
    }),
    [],
  );
}
