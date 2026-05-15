import { useMemo } from 'react';
import { CAMPAIGNS_MODULE } from '../constants/campaigns.constants';

export function useCampaigns() {
  return useMemo(
    () => ({
      module: CAMPAIGNS_MODULE,
      isReady: true,
    }),
    [],
  );
}
