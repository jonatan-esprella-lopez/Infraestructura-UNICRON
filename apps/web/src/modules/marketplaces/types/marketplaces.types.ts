export interface MarketplacesMetric {
  label: string;
  value: string;
  trend: string;
}

export interface MarketplacesItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
