import { useLocation } from 'react-router-dom';

export function Breadcrumb() {
  const segments = useLocation().pathname.split('/').filter(Boolean);

  return <div className="breadcrumb">{segments.join(' / ')}</div>;
}
