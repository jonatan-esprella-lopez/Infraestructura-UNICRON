import type { Service } from '@core/interfaces/service.interface';
import { usersRepository } from '../repositories/users.repository';

export const usersService: Service = {
  name: 'users',
  async initialize() {
    await usersRepository.findAll();
  },
};
