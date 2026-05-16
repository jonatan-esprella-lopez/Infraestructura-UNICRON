import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { SidebarProvider, useSidebar } from './SidebarContext';

function DashboardLayoutInner() {
  const { collapsed } = useSidebar();
  return (
    <div className={`dashboard-layout${collapsed ? ' dashboard-layout--collapsed' : ''}`}>
      <Sidebar />
      <div className="dashboard-layout__shell">
        <MobileNav />
        <Header />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutInner />
    </SidebarProvider>
  );
}
