/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AGENTS_API_URL?: string;
  readonly VITE_ENABLE_MOCKS?: string;
  readonly VITE_CRM_ENABLED?: string;
  readonly VITE_AI_ENABLED?: string;
  readonly VITE_QR_ENABLED?: string;
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_CAMPAIGNS_ENABLED?: string;
  readonly VITE_DOCUMENTS_ENABLED?: string;
  readonly VITE_SCORING_ENABLED?: string;
  readonly VITE_NOTIFICATIONS_ENABLED?: string;
  readonly VITE_USERS_ENABLED?: string;
  readonly VITE_ROLES_ENABLED?: string;
  readonly VITE_SETTINGS_ENABLED?: string;
  readonly VITE_WORKFLOWS_ENABLED?: string;
  readonly VITE_PROPTECH_ENABLED?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
