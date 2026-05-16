export interface ScoringMetric {
  label: string;
  value: string;
  trend: string;
}

export interface ScoringItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
