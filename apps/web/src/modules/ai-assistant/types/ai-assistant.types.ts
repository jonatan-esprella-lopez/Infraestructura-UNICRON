export interface AiAssistantMetric {
  label: string;
  value: string;
  trend: string;
}

export interface AiAssistantItem {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  owner: string;
}
