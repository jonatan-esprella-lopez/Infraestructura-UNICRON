import type { Service } from '@core/interfaces/service.interface';
import { rolesRepository } from '../repositories/roles.repository';

export const rolesService: Service = {
  name: 'roles',
  async initialize() {
    await rolesRepository.findAll();
  },
};
