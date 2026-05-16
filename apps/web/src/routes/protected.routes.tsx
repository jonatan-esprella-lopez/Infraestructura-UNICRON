import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Permission } from '@core/enums/permissions.enum';
import type { Role } from '@core/enums/roles.enum';
import { ROUTES } from './route.constants';
import { usePermissions } from '@shared/hooks/usePermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  permissions?: Permission[];
  roles?: Role[];
}

export function ProtectedRoute({ children, permissions = [], roles = [] }: ProtectedRouteProps) {
  const location = useLocation();
  const { currentUser, hasSomePermission } = usePermissions();

  if (!currentUser?.id) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  const hasAllowedRole = roles.length === 0 || roles.some((role) => currentUser.roles.includes(role));

  if (!hasAllowedRole || !hasSomePermission(permissions)) {
    return <Navigate to={ROUTES.proptech} replace />;
  }

  return <>{children}</>;
}
