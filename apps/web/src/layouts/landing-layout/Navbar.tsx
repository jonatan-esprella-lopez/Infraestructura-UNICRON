import { appConfig } from '@bootstrap/app-config';

export function Navbar() {
  return <nav className="landing-nav">{appConfig.name}</nav>;
}
