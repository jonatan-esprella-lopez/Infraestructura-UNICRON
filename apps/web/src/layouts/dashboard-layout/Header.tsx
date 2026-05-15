import { Bell, Search } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { Button } from '@shared/components/ui/button';
import { useRootStore } from '@store/root-store';

export function Header() {
  const { currentUser } = useRootStore();

  return (
    <header className="dashboard-header">
      <div>
        <Breadcrumb />
        <h1>Command center</h1>
      </div>
      <div className="header-actions">
        <Button variant="ghost" aria-label="Buscar">
          <Search size={18} />
        </Button>
        <Button variant="ghost" aria-label="Notificaciones">
          <Bell size={18} />
        </Button>
        <div className="user-chip">{currentUser.name}</div>
      </div>
    </header>
  );
}
