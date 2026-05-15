import { useContext } from 'react';
import { RootStoreContext } from './root-store.context';

export function useRootStore() {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used inside RootStoreProvider');
  }

  return store;
}
