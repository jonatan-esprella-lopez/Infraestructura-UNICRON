import type { Service } from '@core/interfaces/service.interface';
import { notificationsRepository } from '../repositories/notifications.repository';

export const notificationsService: Service = {
  name: 'notifications',
  async initialize() {
    await notificationsRepository.findAll();
  },
};
