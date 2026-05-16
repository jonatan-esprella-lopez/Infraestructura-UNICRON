import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';

export function LoginForm() {
  return (
    <form className="u-stack">
      <Input aria-label="Email" placeholder="Email" type="email" />
      <Input aria-label="Password" placeholder="Password" type="password" />
      <Button type="button">Entrar</Button>
    </form>
  );
}
