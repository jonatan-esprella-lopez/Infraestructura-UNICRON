import type { Repository } from '@core/interfaces/repository.interface';
import type { WorkflowsItem } from '../types/workflows.types';

const seedItems: WorkflowsItem[] = [
  { id: 'workflows-1', name: 'Workflows operativo', status: 'active', owner: 'Growth Team' },
  { id: 'workflows-2', name: 'Workflows discovery', status: 'draft', owner: 'Product Team' },
];

export const workflowsRepository: Repository<WorkflowsItem> = {
  async findAll() {
    return seedItems;
  },
  async findById(id) {
    return seedItems.find((item) => item.id === id) ?? null;
  },
};
