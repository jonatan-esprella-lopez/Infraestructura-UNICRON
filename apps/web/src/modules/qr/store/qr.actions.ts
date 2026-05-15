import type { QrItem } from '../types/qr.types';

export const qrActions = {
  select(id: string) {
    return { type: 'qr/select', payload: id } as const;
  },
  hydrate(items: QrItem[]) {
    return { type: 'qr/hydrate', payload: items } as const;
  },
};
