import { useLocation } from 'react-router-dom';

export function Breadcrumb() {
  const segments = useLocation().pathname.split('/').filter(Boolean);

  return <div className="dashboard-layout__breadcrumb">{segments.join(' / ')}</div>;
}
