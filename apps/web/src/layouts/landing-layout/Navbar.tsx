import { appConfig } from '@bootstrap/app-config';

export function Navbar() {
  return <nav className="landing-layout__nav">{appConfig.name}</nav>;
}
