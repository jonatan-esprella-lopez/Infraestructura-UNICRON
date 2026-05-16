export interface UsersMetric {
  label: string;
  value: string;
  trend: string;
}

export interface UsersItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
