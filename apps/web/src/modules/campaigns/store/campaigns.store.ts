import type { CampaignsItem } from '../types/campaigns.types';

export interface CampaignsState {
  items: CampaignsItem[];
  selectedId: string | null;
}

export const initialCampaignsState: CampaignsState = {
  items: [],
  selectedId: null,
};
