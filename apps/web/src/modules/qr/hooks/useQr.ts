import { useMemo } from 'react';
import { QR_MODULE } from '../constants/qr.constants';

export function useQr() {
  return useMemo(
    () => ({
      module: QR_MODULE,
      isReady: true,
    }),
    [],
  );
}
