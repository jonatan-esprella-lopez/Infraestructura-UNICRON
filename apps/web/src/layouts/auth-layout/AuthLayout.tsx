import { Outlet } from 'react-router-dom';
import { AuthFooter } from './AuthFooter';
import { AuthHeader } from './AuthHeader';

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </main>
  );
}
