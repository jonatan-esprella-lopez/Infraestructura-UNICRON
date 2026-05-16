import type { SettingsItem } from '../types/settings.types';

export interface SettingsState {
  items: SettingsItem[];
  selectedId: string | null;
}

export const initialSettingsState: SettingsState = {
  items: [],
  selectedId: null,
};
