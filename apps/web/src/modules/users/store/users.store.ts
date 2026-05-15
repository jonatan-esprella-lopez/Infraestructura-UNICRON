import type { UsersItem } from '../types/users.types';

export interface UsersState {
  items: UsersItem[];
  selectedId: string | null;
}

export const initialUsersState: UsersState = {
  items: [],
  selectedId: null,
};
