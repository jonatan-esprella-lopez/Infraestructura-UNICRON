import { useMemo } from 'react';
import { SETTINGS_MODULE } from '../constants/settings.constants';

export function useSettings() {
  return useMemo(
    () => ({
      module: SETTINGS_MODULE,
      isReady: true,
    }),
    [],
  );
}
