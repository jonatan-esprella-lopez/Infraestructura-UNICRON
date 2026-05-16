export interface GamificationMetric {
  label: string;
  value: string;
  trend: string;
}

export interface GamificationItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
