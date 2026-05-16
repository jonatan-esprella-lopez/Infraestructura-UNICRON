import type { Service } from '@core/interfaces/service.interface';
import { qrRepository } from '../repositories/qr.repository';

export const qrService: Service = {
  name: 'qr',
  async initialize() {
    await qrRepository.findAll();
  },
};
