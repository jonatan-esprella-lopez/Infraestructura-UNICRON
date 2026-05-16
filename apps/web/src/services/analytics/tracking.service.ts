export const trackingService = {
  track(eventName: string, payload?: Record<string, unknown>) {
    window.dispatchEvent(new CustomEvent('analytics:track', { detail: { eventName, payload } }));
  },
};
