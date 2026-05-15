import type { CampaignsItem } from '../types/campaigns.types';

export const campaignsActions = {
  select(id: string) {
    return { type: 'campaigns/select', payload: id } as const;
  },
  hydrate(items: CampaignsItem[]) {
    return { type: 'campaigns/hydrate', payload: items } as const;
  },
};
