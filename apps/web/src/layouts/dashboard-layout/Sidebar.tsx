import { NavLink } from 'react-router-dom';
import {
  BarChart3, Bot, BriefcaseBusiness, Building2, CalendarCheck,
  ChevronLeft, ChevronRight, FileSignature, FileText, Gauge,
  Megaphone, QrCode, Receipt, Settings, Shield, Sparkles,
  TrendingUp, UserRoundSearch, Users, WalletCards, Workflow,
  type LucideIcon,
} from 'lucide-react';
import { appConfig } from '@bootstrap/app-config';
import { environment, type FeatureFlagKey } from '@bootstrap/environment';
import { Permission } from '@core/enums/permissions.enum';
import { Role } from '@core/enums/roles.enum';
import { ROUTES } from '@routes/route.constants';
import { usePermissions } from '@shared/hooks/usePermissions';
import { useSidebar } from './SidebarContext';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  featureFlag?: FeatureFlagKey;
  permissions?: Permission[];
  end?: boolean;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const AGENT_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: ROUTES.proptech, icon: Gauge, featureFlag: 'proptech', end: true },
      { label: 'Mis Propiedades', path: ROUTES.proptechProperties, icon: Building2, featureFlag: 'proptech' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Leads', path: ROUTES.proptechLeads, icon: UserRoundSearch, featureFlag: 'proptech' },
      { label: 'Clientes', path: ROUTES.proptechClients, icon: Users, featureFlag: 'proptech' },
      { label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech' },
    ],
  },
  {
    label: 'Herramientas',
    items: [
      { label: 'Matching IA', path: ROUTES.proptechMatching, icon: Sparkles, featureFlag: 'proptech' },
      { label: 'Mis Ventas', path: ROUTES.proptechMySales, icon: Receipt, featureFlag: 'proptech' },
    ],
  },
];

const AGENCY_ADMIN_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Inicio', path: ROUTES.proptech, icon: Building2, featureFlag: 'proptech', end: true },
      { label: 'Propiedades', path: ROUTES.proptechProperties, icon: Building2, featureFlag: 'proptech' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Leads', path: ROUTES.proptechLeads, icon: UserRoundSearch, featureFlag: 'proptech' },
      { label: 'Clientes', path: ROUTES.proptechClients, icon: Users, featureFlag: 'proptech' },
      { label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Matching IA', path: ROUTES.proptechMatching, icon: Sparkles, featureFlag: 'proptech' },
      { label: 'Contratos', path: ROUTES.proptechContracts, icon: FileSignature, featureFlag: 'proptech' },
      { label: 'Ventas', path: ROUTES.proptechSales, icon: Receipt, featureFlag: 'proptech' },
      { label: 'Reportes', path: ROUTES.proptechReports, icon: BarChart3, featureFlag: 'proptech' },
      { label: 'Mercado', path: ROUTES.proptechAnalytics, icon: TrendingUp, featureFlag: 'proptech' },
    ],
  },
];

const OWNER_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Mi panel', path: ROUTES.proptech, icon: Building2, featureFlag: 'proptech', end: true },
      { label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech' },
    ],
  },
];

const CLIENT_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Mi panel', path: ROUTES.proptech, icon: Building2, featureFlag: 'proptech', end: true },
      { label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech' },
    ],
  },
];

const ADMIN_GROUPS: NavGroup[] = [
  {
    label: 'Proptech',
    items: [
      { label: 'Inicio', path: ROUTES.proptech, icon: Building2, featureFlag: 'proptech', end: true },
      { label: 'Propiedades', path: ROUTES.proptechProperties, icon: Building2, featureFlag: 'proptech' },
      { label: 'Leads', path: ROUTES.proptechLeads, icon: UserRoundSearch, featureFlag: 'proptech' },
      { label: 'Clientes', path: ROUTES.proptechClients, icon: Users, featureFlag: 'proptech' },
      { label: 'Visitas', path: ROUTES.proptechVisits, icon: CalendarCheck, featureFlag: 'proptech' },
      { label: 'Matching IA', path: ROUTES.proptechMatching, icon: Sparkles, featureFlag: 'proptech' },
      { label: 'Contratos', path: ROUTES.proptechContracts, icon: FileSignature, featureFlag: 'proptech' },
      { label: 'Ventas', path: ROUTES.proptechSales, icon: Receipt, featureFlag: 'proptech' },
      { label: 'Reportes', path: ROUTES.proptechReports, icon: BarChart3, featureFlag: 'proptech' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Dashboard', path: ROUTES.dashboard, icon: Gauge },
      { label: 'CRM', path: ROUTES.crm, icon: BriefcaseBusiness, featureFlag: 'crm' },
      { label: 'Analytics', path: ROUTES.analytics, icon: BarChart3, featureFlag: 'analytics' },
      { label: 'AI Assistant', path: ROUTES.aiAssistant, icon: Bot, featureFlag: 'ai' },
      { label: 'Campaigns', path: ROUTES.campaigns, icon: Megaphone, featureFlag: 'campaigns' },
      { label: 'Documentos', path: ROUTES.documents, icon: FileText, featureFlag: 'documents' },
      { label: 'Notificaciones', path: ROUTES.notifications, icon: Shield, featureFlag: 'notifications' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Usuarios', path: ROUTES.users, icon: Users, featureFlag: 'users' },
      { label: 'Roles', path: ROUTES.roles, icon: Shield, featureFlag: 'roles' },
      { label: 'Settings', path: ROUTES.settings, icon: Settings, featureFlag: 'settings' },
      { label: 'Workflows', path: ROUTES.workflows, icon: Workflow, featureFlag: 'workflows' },
    ],
  },
];

const GENERAL_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: ROUTES.dashboard, icon: Gauge },
      { label: 'CRM', path: ROUTES.crm, icon: BriefcaseBusiness, featureFlag: 'crm' },
      { label: 'Analytics', path: ROUTES.analytics, icon: BarChart3, featureFlag: 'analytics' },
      { label: 'AI Assistant', path: ROUTES.aiAssistant, icon: Bot, featureFlag: 'ai' },
      { label: 'Campaigns', path: ROUTES.campaigns, icon: Megaphone, featureFlag: 'campaigns' },
      { label: 'Documentos', path: ROUTES.documents, icon: FileText, featureFlag: 'documents' },
      { label: 'Scoring', path: ROUTES.scoring, icon: WalletCards, featureFlag: 'scoring' },
      { label: 'QR', path: ROUTES.qr, icon: QrCode, featureFlag: 'qr' },
      { label: 'Notificaciones', path: ROUTES.notifications, icon: Shield, featureFlag: 'notifications' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Usuarios', path: ROUTES.users, icon: Users, featureFlag: 'users' },
      { label: 'Roles', path: ROUTES.roles, icon: Shield, featureFlag: 'roles' },
      { label: 'Settings', path: ROUTES.settings, icon: Settings, featureFlag: 'settings' },
      { label: 'Workflows', path: ROUTES.workflows, icon: Workflow, featureFlag: 'workflows' },
    ],
  },
];

function getNavGroups(roles: string[]): NavGroup[] {
  if (roles.includes(Role.Agent)) return AGENT_GROUPS;
  if (roles.includes(Role.AgencyAdmin)) return AGENCY_ADMIN_GROUPS;
  if (roles.includes(Role.Owner)) return OWNER_GROUPS;
  if (roles.includes(Role.Client)) return CLIENT_GROUPS;
  if (roles.includes(Role.Admin)) return ADMIN_GROUPS;
  return GENERAL_GROUPS;
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const { currentUser, hasSomePermission } = usePermissions();

  const groups = getNavGroups(currentUser.roles);

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const flagOk = !item.featureFlag || environment.featureFlags[item.featureFlag];
        const permOk = !item.permissions || item.permissions.length === 0 || hasSomePermission(item.permissions);
        return flagOk && permOk;
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">U</span>
          {!collapsed && (
            <div className="sidebar__brand-text">
              <strong>{appConfig.name}</strong>
              <small>PropTech</small>
            </div>
          )}
        </div>
        <button
          className="sidebar__toggle"
          onClick={toggle}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        {visibleGroups.map((group, gi) => (
          <div key={gi} className="sidebar__group">
            {group.label && <span className="sidebar__group-label">{group.label}</span>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {collapsed && <Icon size={17} className="sidebar__link-icon" />}
                  <span className="sidebar__link-label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
