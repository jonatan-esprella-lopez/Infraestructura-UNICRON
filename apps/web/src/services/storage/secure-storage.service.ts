export const secureStorageService = {
  clearSensitiveKeys(keys: string[]) {
    keys.forEach((key) => window.localStorage.removeItem(key));
  },
};
