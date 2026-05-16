import { environment } from '@bootstrap/environment';

export const featureFlags = environment.featureFlags;

export function isFeatureEnabled(flag: keyof typeof featureFlags) {
  return featureFlags[flag];
}
