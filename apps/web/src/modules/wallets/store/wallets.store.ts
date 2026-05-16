import type { WalletsItem } from '../types/wallets.types';

export interface WalletsState {
  items: WalletsItem[];
  selectedId: string | null;
}

export const initialWalletsState: WalletsState = {
  items: [],
  selectedId: null,
};
