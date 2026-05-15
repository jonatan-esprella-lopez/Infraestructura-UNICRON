export interface DocumentsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface DocumentsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
