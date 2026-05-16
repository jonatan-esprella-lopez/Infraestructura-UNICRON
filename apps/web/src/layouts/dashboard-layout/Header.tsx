import { Bell, LogOut, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { Button } from '@shared/components/ui/button';
import { useRootStore } from '@store/root-store';
import { ROUTES } from '@core/constants/routes.constants';

export function Header() {
  const { currentUser, logout } = useRootStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('intersim.token');
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <header className="dashboard-layout__header">
      <div>
        <Breadcrumb />
        <h1 className="dashboard-layout__title">
          {currentUser.name ? `Hola, ${currentUser.name.split(' ')[0]}` : 'Portal INTERSIM'}
        </h1>
      </div>
      <div className="dashboard-layout__header-actions">
        <Button variant="ghost" aria-label="Buscar">
          <Search size={18} />
        </Button>
        <Button variant="ghost" aria-label="Notificaciones">
          <Bell size={18} />
        </Button>
        <Link to={ROUTES.proptechProfile} className="dashboard-layout__user-chip" title="Ver perfil">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt="" className="dashboard-layout__user-avatar" />
          ) : null}
          <span>{currentUser.name}</span>
        </Link>
        <Button variant="ghost" aria-label="Cerrar sesión" onClick={handleLogout} title="Cerrar sesión">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}
