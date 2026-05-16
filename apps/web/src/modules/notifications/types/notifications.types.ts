export interface NotificationsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface NotificationsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
