import type { PermissionsItem } from '../types/permissions.types';

export const permissionsActions = {
  select(id: string) {
    return { type: 'permissions/select', payload: id } as const;
  },
  hydrate(items: PermissionsItem[]) {
    return { type: 'permissions/hydrate', payload: items } as const;
  },
};
