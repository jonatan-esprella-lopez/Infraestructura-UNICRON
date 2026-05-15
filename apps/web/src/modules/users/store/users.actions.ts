import type { UsersItem } from '../types/users.types';

export const usersActions = {
  select(id: string) {
    return { type: 'users/select', payload: id } as const;
  },
  hydrate(items: UsersItem[]) {
    return { type: 'users/hydrate', payload: items } as const;
  },
};
