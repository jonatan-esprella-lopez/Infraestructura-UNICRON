export const pushService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      return 'denied' as NotificationPermission;
    }

    return Notification.requestPermission();
  },
};
