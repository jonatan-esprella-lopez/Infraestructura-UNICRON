import type { WorkflowsItem } from '../types/workflows.types';

export interface WorkflowsState {
  items: WorkflowsItem[];
  selectedId: string | null;
}

export const initialWorkflowsState: WorkflowsState = {
  items: [],
  selectedId: null,
};
