import { Menu } from 'lucide-react';
import { Button } from '@shared/components/ui/button';

export function MobileNav() {
  return (
    <div className="dashboard-layout__mobile-nav">
      <Button variant="ghost" aria-label="Abrir menu">
        <Menu size={18} />
      </Button>
      <strong>UNICRON</strong>
    </div>
  );
}
