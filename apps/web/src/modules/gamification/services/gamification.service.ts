import type { Service } from '@core/interfaces/service.interface';
import { gamificationRepository } from '../repositories/gamification.repository';

export const gamificationService: Service = {
  name: 'gamification',
  async initialize() {
    await gamificationRepository.findAll();
  },
};
