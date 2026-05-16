import { useMemo, type ReactNode } from 'react';
import { defaultUser, RootStoreContext, type RootStore } from './root-store.context';

export function RootStoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo<RootStore>(() => ({ currentUser: defaultUser }), []);

  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
}
