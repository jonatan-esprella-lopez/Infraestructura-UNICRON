import { NavLink } from 'react-router-dom';
import { appConfig } from '@bootstrap/app-config';
import { environment } from '@bootstrap/environment';
import { roleRoutes } from '@routes/role.routes';
import { usePermissions } from '@shared/hooks/usePermissions';

export function Sidebar() {
  const { currentUser, hasSomePermission } = usePermissions();
  const visibleRoutes = roleRoutes.filter((route) => {
    const enabled = !route.featureFlag || environment.featureFlags[route.featureFlag];
    const roleAllowed = route.roles.some((role) => currentUser.roles.includes(role));
    return enabled && roleAllowed && hasSomePermission(route.permissions);
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">U</span>
        <div>
          <strong>{appConfig.name}</strong>
          <small>Hackathon base</small>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Modulos">
        {visibleRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink key={route.path} to={route.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={18} />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
