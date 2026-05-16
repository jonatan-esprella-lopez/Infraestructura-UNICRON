import { createContext } from 'react';
import type { AppUser } from '@core/types/auth.types';

export interface RootStore {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  logout: () => void;
}

export const guestUser: AppUser = {
  id: '',
  name: 'Invitado',
  email: '',
  roles: [],
  permissions: [],
};

export const RootStoreContext = createContext<RootStore | null>(null);
