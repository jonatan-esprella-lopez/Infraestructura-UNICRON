export interface QrMetric {
  label: string;
  value: string;
  trend: string;
}

export interface QrItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
