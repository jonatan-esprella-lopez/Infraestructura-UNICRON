export interface RolesMetric {
  label: string;
  value: string;
  trend: string;
}

export interface RolesItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
