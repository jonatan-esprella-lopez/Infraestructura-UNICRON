import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ROLE_PERMISSIONS } from '@core/constants/permissions.constants';
import { Role } from '@core/enums/roles.enum';
import type { AppUser } from '@core/types/auth.types';

export interface RootStore {
  currentUser: AppUser;
}

const defaultUser: AppUser = {
  id: 'user_admin',
  name: 'UNICRON Admin',
  email: 'admin@unicron.dev',
  roles: [Role.Admin],
  permissions: ROLE_PERMISSIONS[Role.Admin],
};

const RootStoreContext = createContext<RootStore | null>(null);

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo<RootStore>(() => ({ currentUser: defaultUser }), []);

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
}

export function useRootStore() {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used inside RootStoreProvider');
  }

  return store;
}
