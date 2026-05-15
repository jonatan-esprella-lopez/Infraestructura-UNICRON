import type { RolesItem } from '../types/roles.types';

export const rolesActions = {
  select(id: string) {
    return { type: 'roles/select', payload: id } as const;
  },
  hydrate(items: RolesItem[]) {
    return { type: 'roles/hydrate', payload: items } as const;
  },
};
