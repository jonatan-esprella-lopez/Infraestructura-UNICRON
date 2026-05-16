export interface SettingsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface SettingsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
