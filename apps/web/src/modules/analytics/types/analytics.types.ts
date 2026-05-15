export interface AnalyticsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface AnalyticsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
