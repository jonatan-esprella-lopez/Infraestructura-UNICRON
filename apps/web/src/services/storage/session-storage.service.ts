export const sessionStorageService = {
  get(key: string) {
    return window.sessionStorage.getItem(key);
  },
  set(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  },
};
