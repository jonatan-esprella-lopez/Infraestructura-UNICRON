import { useMemo } from 'react';
import { DASHBOARD_MODULE } from '../constants/dashboard.constants';

export function useDashboard() {
  return useMemo(
    () => ({
      module: DASHBOARD_MODULE,
      isReady: true,
    }),
    [],
  );
}
