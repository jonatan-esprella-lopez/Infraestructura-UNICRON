import { Navigate } from 'react-router-dom';
import { ROUTES } from './route.constants';

export const publicRoutes = [
  {
    path: ROUTES.home,
    element: <Navigate to={ROUTES.dashboard} replace />,
  },
];
