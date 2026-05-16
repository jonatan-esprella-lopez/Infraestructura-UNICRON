import { useMemo } from 'react';
import { USERS_MODULE } from '../constants/users.constants';

export function useUsers() {
  return useMemo(
    () => ({
      module: USERS_MODULE,
      isReady: true,
    }),
    [],
  );
}
