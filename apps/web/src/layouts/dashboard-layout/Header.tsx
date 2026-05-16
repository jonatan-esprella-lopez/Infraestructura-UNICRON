import { Bell, Search } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { Button } from '@shared/components/ui/button';
import { useRootStore } from '@store/root-store';

export function Header() {
  const { currentUser } = useRootStore();

  return (
    <header className="dashboard-layout__header">
      <div>
        <Breadcrumb />
        <h1 className="dashboard-layout__title">Command center</h1>
      </div>
      <div className="dashboard-layout__header-actions">
        <Button variant="ghost" aria-label="Buscar">
          <Search size={18} />
        </Button>
        <Button variant="ghost" aria-label="Notificaciones">
          <Bell size={18} />
        </Button>
        <div className="dashboard-layout__user-chip">{currentUser.name}</div>
      </div>
    </header>
  );
}
