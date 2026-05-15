import { APP_CONFIG } from '@core/config/app.config';
import { environment } from './environment';

export const appConfig = {
  ...APP_CONFIG,
  name: environment.appName,
  env: environment.appEnv,
} as const;
