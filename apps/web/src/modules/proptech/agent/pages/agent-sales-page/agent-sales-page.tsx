import { useState, useEffect, useCallback } from 'react';
import { saleService } from '../../../services/sale.service';
import { leadService } from '../../../services/lead.service';
import { propertyService } from '../../../services/property.service';
import type { PropertySale, CreateSalePayload, SaleType, PaymentMethod, SaleLocation, SaleChannel } from '../../../types/sale.types';
import type { Lead } from '../../../types/lead.types';
import type { Property } from '../../../types/property.types';
import {
  SALE_TYPE_LABELS, PAYMENT_METHOD_LABELS, SALE_LOCATION_LABELS, SALE_CHANNEL_LABELS,
} from '../../../types/sale.types';
import { LEAD_STATUS_LABELS } from '../../../types/lead.types';
import './agent-sales-page.css';

/* ─── helpers ──────────────────────────────────────────── */

const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function monthKey(date: Date) { return `${date.getFullYear()}-${date.getMonth()}`; }
function monthLabel(ym: string) {
  const [, m] = ym.split('-');
  return MONTHS_SHORT[Number(m)];
}
function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }
  return months;
}

function groupByMonth<T>(items: T[], getDate: (item: T) => string | undefined): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const raw = getDate(item);
    if (!raw) continue;
    const key = monthKey(new Date(raw));
    const arr = map.get(key) ?? [];
    arr.push(item);
    map.set(key, arr);
  }
  return map;
}

function isThisMonth(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ─── SVG chart ─────────────────────────────────────────── */

interface MonthStats { month: string; captaciones: number; cierres: number; ventas: number; }

function BarChart({ data }: { data: MonthStats[] }) {
  const MAX_BARS = Math.max(...data.flatMap((d) => [d.captaciones, d.cierres, d.ventas]), 1);
  const H = 100;
  const BAR_W = 10;
  const GROUP_W = 52;
  const W = data.length * GROUP_W + 20;
  const scale = (v: number) => (v / MAX_BARS) * H;

  const yTicks = [0, Math.round(MAX_BARS / 2), MAX_BARS].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="mpr-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H + 36}`} className="mpr-chart-svg" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = H - scale(tick);
          return (
            <g key={tick}>
              <line x1="12" x2={W - 4} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y={y + 3} textAnchor="end" fontSize="7" fill="#cbd5e1">{tick}</text>
            </g>
          );
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const x = i * GROUP_W + 16;
          const capH = scale(d.captaciones);
          const cieH = scale(d.cierres);
          const venH = scale(d.ventas);
          return (
            <g key={d.month}>
              {/* Captaciones bar */}
              <rect x={x} y={H - capH} width={BAR_W} height={Math.max(capH, 1)} fill="#3b82f6" rx="2">
                <title>Captaciones: {d.captaciones}</title>
              </rect>
              {/* Cierres bar */}
              <rect x={x + BAR_W + 2} y={H - cieH} width={BAR_W} height={Math.max(cieH, 1)} fill="#22c55e" rx="2">
                <title>Cierres: {d.cierres}</title>
              </rect>
              {/* Ventas bar */}
              <rect x={x + BAR_W * 2 + 4} y={H - venH} width={BAR_W} height={Math.max(venH, 1)} fill="#f59e0b" rx="2">
                <title>Ventas: {d.ventas}</title>
              </rect>
              {/* Month label */}
              <text x={x + BAR_W + 2} y={H + 14} textAnchor="middle" fontSize="8.5" fill="#94a3b8">
                {monthLabel(d.month)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mpr-chart-legend">
        <span className="mpr-legend-dot" style={{ background: '#3b82f6' }} />Captaciones
        <span className="mpr-legend-dot" style={{ background: '#22c55e' }} />Cierres
        <span className="mpr-legend-dot" style={{ background: '#f59e0b' }} />Ventas reg.
      </div>
    </div>
  );
}

/* ─── Register modal ────────────────────────────────────── */

const EMPTY_FORM: CreateSalePayload = {
  saleType: 'property_sale', productOrService: '', amount: 0,
  currency: 'BOB', paymentMethod: 'cash', saleLocation: 'office', saleChannel: 'in_person', notes: '',
};

interface RegisterModalProps { onSave: () => void; onClose: () => void; }
function RegisterModal({ onSave, onClose }: RegisterModalProps) {
  const [form, setForm] = useState<CreateSalePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try { await saleService.create(form); onSave(); }
    catch { setErr('Error al registrar'); }
    finally { setSaving(false); }
  };

  return (
    <div className="mpr-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mpr-modal">
        <div className="mpr-modal__header">
          <h3 className="mpr-modal__title">Registrar producción</h3>
          <button className="mpr-modal__close" onClick={onClose}>✕</button>
        </div>
        <form className="mpr-modal__body" onSubmit={(e) => { void handleSubmit(e); }}>
          <div className="mpr-form-row">
            <div className="mpr-form-group">
              <label className="mpr-form-label">Tipo</label>
              <select className="mpr-form-select" value={form.saleType}
                onChange={(e) => setForm({ ...form, saleType: e.target.value as SaleType })} required>
                {Object.entries(SALE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="mpr-form-group">
              <label className="mpr-form-label">Propiedad / Servicio</label>
              <input className="mpr-form-input" value={form.productOrService}
                onChange={(e) => setForm({ ...form, productOrService: e.target.value })}
                placeholder="Ej: Dpto. 3B Torre Centro" required />
            </div>
          </div>
          <div className="mpr-form-row">
            <div className="mpr-form-group">
              <label className="mpr-form-label">Monto</label>
              <input className="mpr-form-input" type="number" min={0} step={0.01} value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
            </div>
            <div className="mpr-form-group">
              <label className="mpr-form-label">Moneda</label>
              <select className="mpr-form-select" value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="BOB">BOB</option><option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="mpr-form-row">
            <div className="mpr-form-group">
              <label className="mpr-form-label">Método de pago</label>
              <select className="mpr-form-select" value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })} required>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="mpr-form-group">
              <label className="mpr-form-label">Canal</label>
              <select className="mpr-form-select" value={form.saleChannel}
                onChange={(e) => setForm({ ...form, saleChannel: e.target.value as SaleChannel })} required>
                {Object.entries(SALE_CHANNEL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="mpr-form-row">
            <div className="mpr-form-group">
              <label className="mpr-form-label">Lugar</label>
              <select className="mpr-form-select" value={form.saleLocation}
                onChange={(e) => setForm({ ...form, saleLocation: e.target.value as SaleLocation })} required>
                {Object.entries(SALE_LOCATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="mpr-form-group">
              <label className="mpr-form-label">Fecha</label>
              <input className="mpr-form-input" type="date"
                onChange={(e) => setForm({ ...form, soldAt: e.target.value })} />
            </div>
          </div>
          <div className="mpr-form-group">
            <label className="mpr-form-label">Notas</label>
            <textarea className="mpr-form-textarea" rows={2} value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Observaciones..." />
          </div>
          {err && <p className="mpr-form-error">⚠ {err}</p>}
          <div className="mpr-modal__footer">
            <button type="button" className="mpr-btn mpr-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="mpr-btn mpr-btn--primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────── */

type Tab = 'captaciones' | 'cierres' | 'ventas';

export function AgentSalesPage() {
  const [sales, setSales] = useState<PropertySale[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('captaciones');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [salesData, leadsData, propsData] = await Promise.all([
        saleService.findAll(),
        leadService.findAll(),
        propertyService.findAll({}),
      ]);
      setSales(salesData);
      setLeads(leadsData.items);
      setProperties(propsData.items);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  /* ── Derived metrics ─────────────────────── */
  const captaciones = properties; // properties the agent has listed
  const cierres = leads.filter((l) => l.status === 'converted');
  const leadsActivos = leads.filter((l) => !['converted', 'lost'].includes(l.status));
  const volumenMes = sales.filter((s) => isThisMonth(s.soldAt)).reduce((sum, s) => sum + s.amount, 0);
  const captMes = captaciones.filter((p) => isThisMonth(p.createdAt?.toString())).length;
  const cierresMes = cierres.filter((l) => isThisMonth(l.convertedAt)).length;

  /* ── Chart data (last 6 months) ─────────── */
  const months = getLastNMonths(6);
  const capByMonth = groupByMonth(captaciones, (p) => p.createdAt?.toString());
  const cieByMonth = groupByMonth(cierres, (l) => l.convertedAt);
  const venByMonth = groupByMonth(sales, (s) => s.soldAt);
  const chartData: MonthStats[] = months.map((m) => ({
    month: m,
    captaciones: capByMonth.get(m)?.length ?? 0,
    cierres: cieByMonth.get(m)?.length ?? 0,
    ventas: venByMonth.get(m)?.length ?? 0,
  }));

  const TABS: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'captaciones', label: 'Captaciones', count: captaciones.length },
    { key: 'cierres', label: 'Cierres', count: cierres.length },
    { key: 'ventas', label: 'Ventas registradas', count: sales.length },
  ];

  return (
    <div className="mpr">
      {/* Header */}
      <div className="mpr-header">
        <div>
          <p className="mpr-header__crumb">Proptech / Mi Producción</p>
          <h2 className="mpr-header__title">Mi Producción</h2>
          <p className="mpr-header__sub">Captaciones, cierres y rendimiento mensual</p>
        </div>
        <button className="mpr-btn mpr-btn--primary" onClick={() => setShowForm(true)}>
          + Registrar
        </button>
      </div>

      {loading && <div className="mpr-state"><div className="mpr-spinner" /> Cargando producción...</div>}

      {!loading && (
        <>
          {/* KPIs */}
          <div className="mpr-kpis">
            <div className="mpr-kpi" style={{ borderTopColor: '#3b82f6' }}>
              <div className="mpr-kpi__row">
                <span className="mpr-kpi__value" style={{ color: '#3b82f6' }}>{captMes}</span>
                <span className="mpr-kpi__total">/ {captaciones.length} total</span>
              </div>
              <span className="mpr-kpi__label">Captaciones este mes</span>
            </div>
            <div className="mpr-kpi" style={{ borderTopColor: '#8b5cf6' }}>
              <div className="mpr-kpi__row">
                <span className="mpr-kpi__value" style={{ color: '#8b5cf6' }}>{leadsActivos.length}</span>
                <span className="mpr-kpi__total">/ {leads.length} total</span>
              </div>
              <span className="mpr-kpi__label">Leads en gestión</span>
            </div>
            <div className="mpr-kpi" style={{ borderTopColor: '#22c55e' }}>
              <div className="mpr-kpi__row">
                <span className="mpr-kpi__value" style={{ color: '#22c55e' }}>{cierresMes}</span>
                <span className="mpr-kpi__total">/ {cierres.length} total</span>
              </div>
              <span className="mpr-kpi__label">Cierres este mes</span>
            </div>
            <div className="mpr-kpi" style={{ borderTopColor: '#f59e0b' }}>
              <div className="mpr-kpi__row">
                <span className="mpr-kpi__value" style={{ color: '#f59e0b' }}>
                  {volumenMes >= 1000 ? `${(volumenMes / 1000).toFixed(0)}k` : volumenMes.toLocaleString('es-BO')}
                </span>
              </div>
              <span className="mpr-kpi__label">Volumen este mes (BOB)</span>
            </div>
          </div>

          {/* Chart */}
          <div className="mpr-chart-card">
            <div className="mpr-chart-card__header">
              <h3 className="mpr-chart-card__title">Rendimiento mensual</h3>
              <span className="mpr-chart-card__sub">Últimos 6 meses</span>
            </div>
            <BarChart data={chartData} />
          </div>

          {/* Tabs */}
          <div className="mpr-tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`mpr-tab${tab === t.key ? ' mpr-tab--active' : ''}`}
                onClick={() => setTab(t.key)}>
                {t.label}
                <span className="mpr-tab__count">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'captaciones' && (
            <div className="mpr-list">
              {captaciones.length === 0 && (
                <div className="mpr-empty">
                  <span className="mpr-empty__icon">🏢</span>
                  <p className="mpr-empty__text">Sin captaciones registradas</p>
                  <p className="mpr-empty__sub">Las propiedades que captes aparecerán aquí</p>
                </div>
              )}
              {captaciones.map((p) => (
                <div key={p.id} className="mpr-item">
                  <div className="mpr-item__left">
                    <span className="mpr-item__icon">🏠</span>
                    <div className="mpr-item__info">
                      <p className="mpr-item__title">{p.title}</p>
                      <p className="mpr-item__sub">{p.city}{p.zone ? ` · ${p.zone}` : ''} · {p.propertyType} en {p.operationType}</p>
                    </div>
                  </div>
                  <div className="mpr-item__right">
                    <span className="mpr-item__amount">{p.price.toLocaleString('es-BO')} {p.currency}</span>
                    <span className="mpr-pub-badge mpr-pub-badge--{p.publicationStatus}">
                      {p.publicationStatus === 'published' ? 'Publicada' : 'No publicada'}
                    </span>
                    <span className="mpr-item__date">{new Date(p.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'cierres' && (
            <div className="mpr-list">
              {cierres.length === 0 && (
                <div className="mpr-empty">
                  <span className="mpr-empty__icon">🏆</span>
                  <p className="mpr-empty__text">Sin cierres registrados aún</p>
                  <p className="mpr-empty__sub">Los leads convertidos aparecerán aquí</p>
                </div>
              )}
              {cierres.map((l) => (
                <div key={l.id} className="mpr-item">
                  <div className="mpr-item__left">
                    <div className="mpr-avatar">
                      {(l.firstName[0] ?? '') + (l.lastName[0] ?? '')}
                    </div>
                    <div className="mpr-item__info">
                      <p className="mpr-item__title">{l.firstName} {l.lastName}</p>
                      <p className="mpr-item__sub">
                        {l.operationType} · {l.propertyType ?? '—'} · {l.preferredCity ?? '—'}
                      </p>
                    </div>
                  </div>
                  <div className="mpr-item__right">
                    <span className="mpr-status-badge mpr-status-badge--converted">
                      {LEAD_STATUS_LABELS[l.status]}
                    </span>
                    {l.convertedAt && (
                      <span className="mpr-item__date">{new Date(l.convertedAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'ventas' && (
            <div className="mpr-list">
              {sales.length === 0 && (
                <div className="mpr-empty">
                  <span className="mpr-empty__icon">💰</span>
                  <p className="mpr-empty__text">Sin ventas registradas</p>
                  <p className="mpr-empty__sub">Registra tu primera producción con el botón de arriba</p>
                </div>
              )}
              {sales.map((s) => (
                <div key={s.id} className="mpr-item">
                  <div className="mpr-item__left">
                    <span className="mpr-item__icon">💼</span>
                    <div className="mpr-item__info">
                      <p className="mpr-item__title">{s.productOrService}</p>
                      <p className="mpr-item__sub">
                        {SALE_TYPE_LABELS[s.saleType]} · {PAYMENT_METHOD_LABELS[s.paymentMethod]} · {SALE_LOCATION_LABELS[s.saleLocation]}
                      </p>
                    </div>
                  </div>
                  <div className="mpr-item__right">
                    <span className="mpr-item__amount" style={{ color: '#16a34a' }}>
                      {s.amount.toLocaleString('es-BO')} {s.currency}
                    </span>
                    <span className="mpr-item__date">{new Date(s.soldAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <RegisterModal onSave={() => { setShowForm(false); void load(); }} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
