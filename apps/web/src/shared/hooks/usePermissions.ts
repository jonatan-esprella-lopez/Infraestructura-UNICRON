import { useMemo } from 'react';
import type { Permission } from '@core/enums/permissions.enum';
import type { Role } from '@core/enums/roles.enum';
import { useRootStore } from '@store/root-store';

export function usePermissions() {
  const { currentUser } = useRootStore();

  return useMemo(
    () => ({
      currentUser,
      hasRole: (role: Role) => currentUser.roles.includes(role),
      hasPermission: (permission: Permission) => currentUser.permissions.includes(permission),
      hasEveryPermission: (permissions: Permission[]) =>
        permissions.every((permission) => currentUser.permissions.includes(permission)),
      hasSomePermission: (permissions: Permission[]) =>
        permissions.length === 0 || permissions.some((permission) => currentUser.permissions.includes(permission)),
    }),
    [currentUser],
  );
}
