import type { Service } from '@core/interfaces/service.interface';
import { workflowsRepository } from '../repositories/workflows.repository';

export const workflowsService: Service = {
  name: 'workflows',
  async initialize() {
    await workflowsRepository.findAll();
  },
};
