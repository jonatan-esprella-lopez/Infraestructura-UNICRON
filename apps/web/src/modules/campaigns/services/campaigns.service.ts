import type { Service } from '@core/interfaces/service.interface';
import { campaignsRepository } from '../repositories/campaigns.repository';

export const campaignsService: Service = {
  name: 'campaigns',
  async initialize() {
    await campaignsRepository.findAll();
  },
};
