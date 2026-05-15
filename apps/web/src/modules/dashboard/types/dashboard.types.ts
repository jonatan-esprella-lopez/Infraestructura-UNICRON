export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
}

export interface DashboardItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
