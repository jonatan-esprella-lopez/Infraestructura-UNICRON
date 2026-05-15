import { registerService } from './dependency-injection';
import { analyticsService } from '@services/analytics/analytics.service';
import { authService } from '@services/auth/auth.service';
import { notificationService } from '@services/notifications/notification.service';

export function initializeServices() {
  registerService(authService);
  registerService(analyticsService);
  registerService(notificationService);
}
