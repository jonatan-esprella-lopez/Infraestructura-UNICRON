import type { Service } from '@core/interfaces/service.interface';
import { scoringRepository } from '../repositories/scoring.repository';

export const scoringService: Service = {
  name: 'scoring',
  async initialize() {
    await scoringRepository.findAll();
  },
};
