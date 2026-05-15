export interface CampaignsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface CampaignsItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
