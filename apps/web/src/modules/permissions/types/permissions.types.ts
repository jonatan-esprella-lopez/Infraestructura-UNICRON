export interface PermissionsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface PermissionsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
