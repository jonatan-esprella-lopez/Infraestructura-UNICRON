export const speechService = {
  isSupported() {
    return 'speechSynthesis' in window;
  },
};
