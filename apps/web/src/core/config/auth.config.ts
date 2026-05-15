import { ROUTES } from '@core/constants/routes.constants';

export const authConfig = {
  loginPath: ROUTES.login,
  afterLoginPath: ROUTES.dashboard,
  tokenStorageKey: 'unicron.access_token',
} as const;
