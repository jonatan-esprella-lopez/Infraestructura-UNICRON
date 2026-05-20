const truthy = new Set(['true', '1', 'yes', 'on']);
const productionAppUrl = 'https://wasi.pages.dev';
const productionApiBaseUrl = 'https://infraestructura-unicron-api.vercel.app/api';
const productionAgentsApiUrl = 'https://casalens-agents-production.up.railway.app';

function readBoolean(value: string | undefined, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return truthy.has(value.toLowerCase());
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function resolveUrl(productionValue: string, developmentValue: string | undefined, developmentFallback: string) {
  return normalizeBaseUrl(import.meta.env.PROD ? productionValue : (developmentValue ?? developmentFallback));
}

export const environment = {
  appName: import.meta.env.VITE_APP_NAME ?? 'UNICRON Enterprise Starter',
  appEnv: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
  appUrl: resolveUrl(productionAppUrl, import.meta.env.VITE_APP_URL, 'http://localhost:5173'),
  apiBaseUrl: resolveUrl(productionApiBaseUrl, import.meta.env.VITE_API_BASE_URL, '/api'),
  agentsApiUrl: resolveUrl(productionAgentsApiUrl, import.meta.env.VITE_AGENTS_API_URL, productionAgentsApiUrl),
  enableMocks: readBoolean(import.meta.env.VITE_ENABLE_MOCKS, true),
  featureFlags: {
    crm: readBoolean(import.meta.env.VITE_CRM_ENABLED, true),
    ai: readBoolean(import.meta.env.VITE_AI_ENABLED, true),
    qr: readBoolean(import.meta.env.VITE_QR_ENABLED, true),
    analytics: readBoolean(import.meta.env.VITE_ANALYTICS_ENABLED, true),
    campaigns: readBoolean(import.meta.env.VITE_CAMPAIGNS_ENABLED, true),
    documents: readBoolean(import.meta.env.VITE_DOCUMENTS_ENABLED, true),
    scoring: readBoolean(import.meta.env.VITE_SCORING_ENABLED, true),
    notifications: readBoolean(import.meta.env.VITE_NOTIFICATIONS_ENABLED, true),
    users: readBoolean(import.meta.env.VITE_USERS_ENABLED, true),
    roles: readBoolean(import.meta.env.VITE_ROLES_ENABLED, true),
    settings: readBoolean(import.meta.env.VITE_SETTINGS_ENABLED, true),
    workflows: readBoolean(import.meta.env.VITE_WORKFLOWS_ENABLED, true),
    proptech: readBoolean(import.meta.env.VITE_PROPTECH_ENABLED, true),
  },
} as const;

export type FeatureFlagKey = keyof typeof environment.featureFlags;
