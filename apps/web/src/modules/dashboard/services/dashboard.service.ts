import type { Service } from '@core/interfaces/service.interface';
import { dashboardRepository } from '../repositories/dashboard.repository';

export const dashboardService: Service = {
  name: 'dashboard',
  async initialize() {
    await dashboardRepository.findAll();
  },
};
