import type { Service } from '@core/interfaces/service.interface';
import { marketplacesRepository } from '../repositories/marketplaces.repository';

export const marketplacesService: Service = {
  name: 'marketplaces',
  async initialize() {
    await marketplacesRepository.findAll();
  },
};
