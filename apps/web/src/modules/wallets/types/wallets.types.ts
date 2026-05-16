export interface WalletsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface WalletsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
