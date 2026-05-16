import type { QrItem } from '../types/qr.types';

export interface QrState {
  items: QrItem[];
  selectedId: string | null;
}

export const initialQrState: QrState = {
  items: [],
  selectedId: null,
};
