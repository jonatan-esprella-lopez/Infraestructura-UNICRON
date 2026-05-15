import type { RolesItem } from '../types/roles.types';

export interface RolesState {
  items: RolesItem[];
  selectedId: string | null;
}

export const initialRolesState: RolesState = {
  items: [],
  selectedId: null,
};
