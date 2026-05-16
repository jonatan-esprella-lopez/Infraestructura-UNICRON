import { useMemo } from 'react';
import { ANALYTICS_MODULE } from '../constants/analytics.constants';

export function useAnalytics() {
  return useMemo(
    () => ({
      module: ANALYTICS_MODULE,
      isReady: true,
    }),
    [],
  );
}
