import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { ROLE_PERMISSIONS } from '@core/constants/permissions.constants';
import type { Role } from '@core/enums/roles.enum';
import type { AppUser } from '@core/types/auth.types';
import { guestUser, RootStoreContext, type RootStore } from './root-store.context';

const STORAGE_KEY = 'intersim.user';

function loadUser(): AppUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return guestUser;
    const parsed = JSON.parse(raw) as AppUser;
    if (!parsed?.id) return guestUser;
    // Re-hydrate permissions from roles in case they changed
    const roles = parsed.roles ?? [];
    const permissions = roles.flatMap((r) => ROLE_PERMISSIONS[r as Role] ?? []);
    return { ...parsed, permissions };
  } catch {
    return guestUser;
  }
}

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AppUser>(loadUser);

  const setCurrentUser = useCallback((user: AppUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUserState(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUserState(guestUser);
  }, []);

  const store = useMemo<RootStore>(
    () => ({ currentUser, setCurrentUser, logout }),
    [currentUser, setCurrentUser, logout],
  );

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
}
