import type { Service } from '@core/interfaces/service.interface';
import { permissionsRepository } from '../repositories/permissions.repository';

export const permissionsService: Service = {
  name: 'permissions',
  async initialize() {
    await permissionsRepository.findAll();
  },
};
