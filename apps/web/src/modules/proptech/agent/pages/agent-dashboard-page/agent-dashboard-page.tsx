import { useState } from 'react';
import { useProptechDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import type { AgentDashboard } from '../../../shared/hooks/use-proptech-dashboard';
import './agent-dashboard-page.css';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function currentPeriodLabel() {
  const now = new Date();
  const m = MONTHS[now.getMonth()];
  const y = now.getFullYear();
  const last = new Date(y, now.getMonth() + 1, 0).getDate();
  return `01 ${m} ${y} — ${last} ${m} ${y}`;
}

function n(v: number | undefined) { return v ?? 0; }

function SectionTitle({ icon, title, action }: { icon: string; title: string; action?: string }) {
  return (
    <div className="adp-section-header">
      <h3 className="adp-section-title">
        <span className="adp-section-icon">{icon}</span>{title}
      </h3>
      {action && <a href="#" className="adp-section-link">{action} ›</a>}
    </div>
  );
}

function KpiCard({
  label, value, sub, variant = 'default', icon, extra,
}: {
  label: string; value: number | string; sub?: string;
  variant?: 'default' | 'dark' | 'accent'; icon?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className={`adp-kpi adp-kpi--${variant}`}>
      <div className="adp-kpi__top">
        <span className="adp-kpi__label">{label}</span>
        {icon && <span className="adp-kpi__icon">{icon}</span>}
      </div>
      <span className="adp-kpi__value">{value}</span>
      {sub && <span className="adp-kpi__sub">{sub}</span>}
      {extra}
    </div>
  );
}

function ClosingCard({ icon, label, value, color }: { icon: string; label: string; value: number; color?: string }) {
  return (
    <div className="adp-closing">
      <span className="adp-closing__icon" style={color ? { color } : undefined}>{icon}</span>
      <div className="adp-closing__body">
        <span className="adp-closing__label">{label}</span>
        <span className="adp-closing__value">{value}</span>
      </div>
    </div>
  );
}

export function AgentDashboardPage() {
  const { data, loading, error } = useProptechDashboard();
  const kpis = data as AgentDashboard | null;
  const [period] = useState(currentPeriodLabel());

  return (
    <div className="adp">

      {/* Header */}
      <div className="adp-header">
        <div className="adp-header__left">
          <p className="adp-header__breadcrumb">Dashboard / Mi rendimiento</p>
          <p className="adp-header__sub">Resumen de tu rendimiento y producción</p>
        </div>
        <button className="adp-period-btn">
          📅 {period} <span className="adp-period-btn__caret">▾</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="adp-state">
          <div className="adp-spinner" />
          <span>Cargando tu panel...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="adp-state adp-state--error">
          ⚠️ {error}
        </div>
      )}

      {/* Inventario de Propiedades */}
      <section className="adp-section">
        <SectionTitle icon="🏠" title="Inventario de Propiedades" />
        <div className="adp-grid adp-grid--3">
          <KpiCard label="PROPIEDADES ASIGNADAS" value={n(kpis?.assignedProperties)} sub="En tu cartera activa"    icon="🏢" />
          <KpiCard label="LEADS NUEVOS"           value={n(kpis?.newLeads)}           sub="Pendientes de contacto" icon="✏️" />
          <KpiCard label="CLIENTES ACTIVOS"       value={n(kpis?.hotClients)}         sub="Con interés confirmado" icon="👥" />
        </div>
      </section>

      {/* Rendimiento Financiero */}
      <section className="adp-section">
        <SectionTitle icon="💰" title="Rendimiento Financiero" />
        <div className="adp-grid adp-grid--3">
          <KpiCard
            variant="dark"
            label="ACUMULADO HISTÓRICO"
            value="Bs 0"
            extra={
              <div className="adp-kpi__row">
                <span>Neto Total: Bs 0</span><span>Bruto Total</span>
              </div>
            }
          />
          <KpiCard
            label="PERIODO ACTUAL"
            value="Bs 0"
            extra={
              <div className="adp-kpi__row">
                <span>Neto: Bs 0</span>
                <a href="#" className="adp-link">Bruto este periodo</a>
              </div>
            }
          />
          <KpiCard
            variant="accent"
            label="COMISIONES POR COBRAR"
            value="Bs 0"
            extra={
              <div className="adp-kpi__status">
                <span className="adp-kpi__dot" />
                En revisión de administración
              </div>
            }
          />
        </div>
      </section>

      {/* Control de Visitas y Cierres */}
      <section className="adp-section">
        <SectionTitle icon="📋" title="Control de Visitas y Cierres" action="Ver Todo" />
        <div className="adp-grid adp-grid--4">
          <ClosingCard icon="✔✔" label="Visitas Totales"      value={n(kpis?.todayVisits)}      color="#1e3a8a" />
          <ClosingCard icon="✅" label="Visitas Hoy"          value={n(kpis?.followUpsToday)}   color="#16a34a" />
          <ClosingCard icon="🎯" label="Ofertas Activas"      value={n(kpis?.activeOffers)}     color="#2563eb" />
          <ClosingCard icon="⏳" label="Contratos Pendientes" value={n(kpis?.contractsPending)} color="#b45309" />
        </div>
      </section>

    </div>
  );
}
