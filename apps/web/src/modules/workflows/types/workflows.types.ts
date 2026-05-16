export interface WorkflowsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface WorkflowsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
