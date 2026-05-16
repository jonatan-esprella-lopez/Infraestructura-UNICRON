import type { Service } from '@core/interfaces/service.interface';
import { analyticsRepository } from '../repositories/analytics.repository';

export const analyticsService: Service = {
  name: 'analytics',
  async initialize() {
    await analyticsRepository.findAll();
  },
};
