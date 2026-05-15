import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { environment } from '@bootstrap/environment';
import { DashboardLayout } from '@layouts/dashboard-layout/DashboardLayout';
import { AuthLayout } from '@layouts/auth-layout/AuthLayout';
import { Loading } from '@shared/components/feedback/loading';
import { AuthPage } from '@modules/auth/pages/AuthPage';
import { lazyModuleRoutes } from './lazy.routes';
import { ProtectedRoute } from './protected.routes';
import { ROUTES } from './route.constants';

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage />} />
        </Route>
        <Route path="app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {lazyModuleRoutes
            .filter((route) => !route.featureFlag || environment.featureFlags[route.featureFlag])
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute permissions={route.permissions} roles={route.roles}>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </Suspense>
  );
}
