export const sessionService = {
  getSessionId() {
    return window.sessionStorage.getItem('unicron.session_id');
  },
};
