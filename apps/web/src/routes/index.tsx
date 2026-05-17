import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { environment } from '@bootstrap/environment';
import { DashboardLayout } from '@layouts/dashboard-layout/DashboardLayout';
import { AuthLayout } from '@layouts/auth-layout/AuthLayout';
import { LandingLayout } from '@layouts/landing-layout/LandingLayout';
import { Loading } from '@shared/components/feedback/loading';
import { AuthPage } from '@modules/auth/pages/AuthPage';
import { lazyModuleRoutes } from './lazy.routes';
import { ProtectedRoute } from './protected.routes';

const LandingPage = lazy(() =>
  import('@modules/intersim/pages/landing-page/landing-page').then((m) => ({ default: m.LandingPage })),
);
const PropertiesPage = lazy(() =>
  import('@modules/intersim/pages/properties-page/properties-page').then((m) => ({ default: m.PropertiesPage })),
);
const PropertiesMapPage = lazy(() =>
  import('@modules/intersim/pages/properties-map-page/properties-map-page').then((m) => ({ default: m.PropertiesMapPage })),
);
const ServicesPage = lazy(() =>
  import('@modules/intersim/pages/services-page/services-page').then((m) => ({ default: m.ServicesPage })),
);
const AboutPage = lazy(() =>
  import('@modules/intersim/pages/about-page/about-page').then((m) => ({ default: m.AboutPage })),
);
const ValuationPage = lazy(() =>
  import('@modules/intersim/pages/valuation-page/valuation-page').then((m) => ({ default: m.ValuationPage })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public landing */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/propiedades" element={<PropertiesPage />} />
          <Route path="/propiedades/mapa" element={<PropertiesMapPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/valoriza-tu-propiedad" element={<ValuationPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<AuthPage />} />
        </Route>

        {/* App */}
        <Route path="app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="proptech" replace />} />
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
