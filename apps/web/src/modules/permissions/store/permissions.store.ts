import type { PermissionsItem } from '../types/permissions.types';

export interface PermissionsState {
  items: PermissionsItem[];
  selectedId: string | null;
}

export const initialPermissionsState: PermissionsState = {
  items: [],
  selectedId: null,
};
