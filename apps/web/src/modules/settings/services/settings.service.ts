import type { Service } from '@core/interfaces/service.interface';
import { settingsRepository } from '../repositories/settings.repository';

export const settingsService: Service = {
  name: 'settings',
  async initialize() {
    await settingsRepository.findAll();
  },
};
