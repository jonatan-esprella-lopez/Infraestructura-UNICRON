import type { WorkflowsItem } from '../types/workflows.types';

export const workflowsActions = {
  select(id: string) {
    return { type: 'workflows/select', payload: id } as const;
  },
  hydrate(items: WorkflowsItem[]) {
    return { type: 'workflows/hydrate', payload: items } as const;
  },
};
