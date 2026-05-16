import { useMemo } from 'react';
import { PERMISSIONS_MODULE } from '../constants/permissions.constants';

export function usePermissions() {
  return useMemo(
    () => ({
      module: PERMISSIONS_MODULE,
      isReady: true,
    }),
    [],
  );
}
