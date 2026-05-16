import { appConfig } from '@bootstrap/app-config';

export function AuthHeader() {
  return (
    <header className="auth-layout__header">
      <strong>{appConfig.name}</strong>
    </header>
  );
}
