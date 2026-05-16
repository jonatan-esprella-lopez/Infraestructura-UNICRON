import { useMemo } from 'react';
import { MARKETPLACES_MODULE } from '../constants/marketplaces.constants';

export function useMarketplaces() {
  return useMemo(
    () => ({
      module: MARKETPLACES_MODULE,
      isReady: true,
    }),
    [],
  );
}
