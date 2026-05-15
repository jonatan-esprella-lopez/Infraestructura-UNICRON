import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { ROUTES } from '@core/constants/routes.constants';

export function AuthPage() {
  const navigate = useNavigate();

  return (
    <section className="auth-card">
      <h1>Acceso enterprise</h1>
      <p>Sesion preparada para demo con permisos por rol.</p>
      <form>
        <Input type="email" placeholder="admin@unicron.dev" aria-label="Email" />
        <Input type="password" placeholder="Password" aria-label="Password" />
        <Button type="button" onClick={() => navigate(ROUTES.dashboard)}>
          Entrar
        </Button>
      </form>
    </section>
  );
}
