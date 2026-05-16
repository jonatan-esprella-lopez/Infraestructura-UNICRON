import { authConfig } from '@core/config/auth.config';

export const tokenService = {
  get() {
    return window.localStorage.getItem(authConfig.tokenStorageKey);
  },
  set(token: string) {
    window.localStorage.setItem(authConfig.tokenStorageKey, token);
  },
  clear() {
    window.localStorage.removeItem(authConfig.tokenStorageKey);
  },
};
