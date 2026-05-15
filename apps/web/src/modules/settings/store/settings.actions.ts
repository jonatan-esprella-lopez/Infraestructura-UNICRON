import type { SettingsItem } from '../types/settings.types';

export const settingsActions = {
  select(id: string) {
    return { type: 'settings/select', payload: id } as const;
  },
  hydrate(items: SettingsItem[]) {
    return { type: 'settings/hydrate', payload: items } as const;
  },
};
