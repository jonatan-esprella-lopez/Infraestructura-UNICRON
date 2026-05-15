import type { WalletsItem } from '../types/wallets.types';

export const walletsActions = {
  select(id: string) {
    return { type: 'wallets/select', payload: id } as const;
  },
  hydrate(items: WalletsItem[]) {
    return { type: 'wallets/hydrate', payload: items } as const;
  },
};
