const truthy = new Set(['true', '1', 'yes', 'on']);

function readBoolean(key: keyof ImportMetaEnv, fallback = false) {
  const value = import.meta.env[key];
  if (value === undefined) {
    return fallback;
  }

  return truthy.has(value.toLowerCase());
}

export const environment = {
  appName: import.meta.env.VITE_APP_NAME ?? 'UNICRON Enterprise Starter',
  appEnv: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  enableMocks: readBoolean('VITE_ENABLE_MOCKS', true),
  featureFlags: {
    crm: readBoolean('VITE_CRM_ENABLED', true),
    ai: readBoolean('VITE_AI_ENABLED', true),
    qr: readBoolean('VITE_QR_ENABLED', true),
    analytics: readBoolean('VITE_ANALYTICS_ENABLED', true),
    campaigns: readBoolean('VITE_CAMPAIGNS_ENABLED', true),
    documents: readBoolean('VITE_DOCUMENTS_ENABLED', true),
    scoring: readBoolean('VITE_SCORING_ENABLED', true),
    notifications: readBoolean('VITE_NOTIFICATIONS_ENABLED', true),
    users: readBoolean('VITE_USERS_ENABLED', true),
    roles: readBoolean('VITE_ROLES_ENABLED', true),
    settings: readBoolean('VITE_SETTINGS_ENABLED', true),
    workflows: readBoolean('VITE_WORKFLOWS_ENABLED', true),
  },
} as const;

export type FeatureFlagKey = keyof typeof environment.featureFlags;
