import { createContext } from 'react';
import { ROLE_PERMISSIONS } from '@core/constants/permissions.constants';
import { Role } from '@core/enums/roles.enum';
import type { AppUser } from '@core/types/auth.types';

export interface RootStore {
  currentUser: AppUser;
}

export const defaultUser: AppUser = {
  id: 'user_admin',
  name: 'UNICRON Admin',
  email: 'admin@unicron.dev',
  roles: [Role.Admin],
  permissions: ROLE_PERMISSIONS[Role.Admin],
};

export const RootStoreContext = createContext<RootStore | null>(null);
