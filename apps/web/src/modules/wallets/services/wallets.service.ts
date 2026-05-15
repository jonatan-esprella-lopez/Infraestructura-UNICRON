import type { Service } from '@core/interfaces/service.interface';
import { walletsRepository } from '../repositories/wallets.repository';

export const walletsService: Service = {
  name: 'wallets',
  async initialize() {
    await walletsRepository.findAll();
  },
};
