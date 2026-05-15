import { useMemo } from 'react';
import { WALLETS_MODULE } from '../constants/wallets.constants';

export function useWallets() {
  return useMemo(
    () => ({
      module: WALLETS_MODULE,
      isReady: true,
    }),
    [],
  );
}
