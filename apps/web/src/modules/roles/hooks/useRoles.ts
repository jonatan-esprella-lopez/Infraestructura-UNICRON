import { useMemo } from 'react';
import { ROLES_MODULE } from '../constants/roles.constants';

export function useRoles() {
  return useMemo(
    () => ({
      module: ROLES_MODULE,
      isReady: true,
    }),
    [],
  );
}
