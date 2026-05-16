import { useRootStore } from '@store/root-store';

export function useAuth() {
  const { currentUser } = useRootStore();
  return { currentUser, isAuthenticated: Boolean(currentUser) };
}
