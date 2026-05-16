import { useState, useCallback } from 'react';
import { useLeads } from '../../../hooks/use-leads';
import { leadService } from '../../../services/lead.service';
import type { Lead, LeadStatus, LeadSource, CreateLeadPayload, LeadFilters } from '../../../types/lead.types';
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
} from '../../../types/lead.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../../constants/property-types.constant';
import './agent-leads-page.css';

const STATUS_FLOW: LeadStatus[] = ['new', 'contacted', 'interested', 'visit_scheduled', 'offer_sent', 'converted', 'lost'];

const EMPTY_FORM: CreateLeadPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  source: 'manual',
  status: 'new',
  operationType: '',
  propertyType: '',
  budgetMin: undefined,
  budgetMax: undefined,
  currency: 'BOB',
  preferredCity: '',
  notes: '',
};

function initials(lead: Lead) {
  return `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();
}

function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span className="alp-status-pill" style={{ background: LEAD_STATUS_COLORS[status] + '20', color: LEAD_STATUS_COLORS[status] }}>
      <span className="alp-status-dot" style={{ background: LEAD_STATUS_COLORS[status] }} />
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

function SourceBadge({ source }: { source: LeadSource }) {
  return <span className="alp-source-badge">{LEAD_SOURCE_LABELS[source]}</span>;
}

interface LeadModalProps {
  initial?: Lead | null;
  onSave: () => void;
  onClose: () => void;
}

function LeadModal({ initial, onSave, onClose }: LeadModalProps) {
  const [form, setForm] = useState<CreateLeadPayload>(
    initial
      ? {
          firstName: initial.firstName,
          lastName: initial.lastName,
          email: initial.email,
          phone: initial.phone,
          source: initial.source,
          status: initial.status,
          operationType: initial.operationType,
          propertyType: initial.propertyType,
          budgetMin: initial.budgetMin,
          budgetMax: initial.budgetMax,
          currency: initial.currency,
          preferredCity: initial.preferredCity,
          notes: initial.notes,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) { setErr('Nombre y apellido son requeridos'); return; }
    setSaving(true);
    setErr('');
    try {
      if (initial) {
        await leadService.update(initial.id, form);
      } else {
        await leadService.create(form);
      }
      onSave();
    } catch {
      setErr('Error al guardar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const f = <K extends keyof CreateLeadPayload>(k: K, v: CreateLeadPayload[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="alp-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="alp-modal">
        <div className="alp-modal__header">
          <h2 className="alp-modal__title">{initial ? 'Editar Lead' : 'Nuevo Lead'}</h2>
          <button className="alp-modal__close" onClick={onClose}>✕</button>
        </div>

        <form className="alp-modal__body" onSubmit={(e) => { void handleSubmit(e); }}>
          {err && <div className="alp-modal__error">{err}</div>}

          <div className="alp-form-section">
            <p className="alp-form-section__title">Datos personales</p>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Nombre *</label>
                <input className="alp-form-input" value={form.firstName} onChange={(e) => f('firstName', e.target.value)} placeholder="Ej. Carlos" required />
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Apellido *</label>
                <input className="alp-form-input" value={form.lastName} onChange={(e) => f('lastName', e.target.value)} placeholder="Ej. Mamani" required />
              </div>
            </div>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Teléfono</label>
                <input className="alp-form-input" value={form.phone ?? ''} onChange={(e) => f('phone', e.target.value)} placeholder="+591 7XXXXXXX" />
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Email</label>
                <input className="alp-form-input" type="email" value={form.email ?? ''} onChange={(e) => f('email', e.target.value)} placeholder="correo@ejemplo.com" />
              </div>
            </div>
          </div>

          <div className="alp-form-section">
            <p className="alp-form-section__title">Clasificación</p>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Estado</label>
                <select className="alp-form-select" value={form.status} onChange={(e) => f('status', e.target.value as LeadStatus)}>
                  {STATUS_FLOW.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Fuente</label>
                <select className="alp-form-select" value={form.source} onChange={(e) => f('source', e.target.value as LeadSource)}>
                  {Object.entries(LEAD_SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="alp-form-section">
            <p className="alp-form-section__title">Preferencias de búsqueda</p>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Tipo de operación</label>
                <select className="alp-form-select" value={form.operationType ?? ''} onChange={(e) => f('operationType', e.target.value || undefined)}>
                  <option value="">Cualquiera</option>
                  {Object.entries(OPERATION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Tipo de inmueble</label>
                <select className="alp-form-select" value={form.propertyType ?? ''} onChange={(e) => f('propertyType', e.target.value || undefined)}>
                  <option value="">Cualquiera</option>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Presupuesto mín.</label>
                <input className="alp-form-input" type="number" value={form.budgetMin ?? ''} onChange={(e) => f('budgetMin', e.target.value ? Number(e.target.value) : undefined)} placeholder="0" />
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Presupuesto máx.</label>
                <input className="alp-form-input" type="number" value={form.budgetMax ?? ''} onChange={(e) => f('budgetMax', e.target.value ? Number(e.target.value) : undefined)} placeholder="Sin límite" />
              </div>
              <div className="alp-form-group alp-form-group--sm">
                <label className="alp-form-label">Moneda</label>
                <select className="alp-form-select" value={form.currency} onChange={(e) => f('currency', e.target.value)}>
                  <option value="BOB">BOB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="alp-form-row">
              <div className="alp-form-group">
                <label className="alp-form-label">Ciudad preferida</label>
                <input className="alp-form-input" value={form.preferredCity ?? ''} onChange={(e) => f('preferredCity', e.target.value || undefined)} placeholder="ej. La Paz" />
              </div>
            </div>
          </div>

          <div className="alp-form-section">
            <p className="alp-form-section__title">Notas</p>
            <textarea className="alp-form-textarea" rows={3} value={form.notes ?? ''} onChange={(e) => f('notes', e.target.value)} placeholder="Observaciones adicionales..." />
          </div>

          <div className="alp-modal__footer">
            <button type="button" className="alp-btn alp-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="alp-btn alp-btn--primary" disabled={saving}>
              {saving ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const STATUS_TABS: Array<{ value: LeadStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'interested', label: 'Interesados' },
  { value: 'visit_scheduled', label: 'Visita agendada' },
  { value: 'converted', label: 'Convertidos' },
  { value: 'lost', label: 'Perdidos' },
];

export function AgentLeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>({ limit: 50 });
  const [activeTab, setActiveTab] = useState<LeadStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const { leads, total, loading, error, reload } = useLeads(filters);

  const handleTabChange = (status: LeadStatus | '') => {
    setActiveTab(status);
    setFilters((f) => ({ ...f, status: status || undefined }));
  };

  const handleStatusChange = useCallback(async (lead: Lead, status: LeadStatus) => {
    try {
      await leadService.update(lead.id, { status });
      reload();
    } catch { /* ignore */ }
  }, [reload]);

  const handleSaved = () => {
    setShowModal(false);
    setEditLead(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este lead?')) return;
    try {
      await leadService.delete(id);
      reload();
    } catch { /* ignore */ }
  };

  const countByStatus = (status: LeadStatus) => leads.filter((l) => l.status === status).length;

  return (
    <div className="alp">
      {/* Header */}
      <div className="alp-header">
        <div>
          <p className="alp-header__crumb">Proptech / Leads</p>
          <h2 className="alp-header__title">Gestión de Leads</h2>
        </div>
        <button className="alp-btn alp-btn--primary" onClick={() => { setEditLead(null); setShowModal(true); }}>
          + Nuevo Lead
        </button>
      </div>

      {/* KPI chips */}
      <div className="alp-kpis">
        {[
          { label: 'Total', value: total, color: '#1e3a8a' },
          { label: 'Nuevos', value: countByStatus('new'), color: '#3b82f6' },
          { label: 'Interesados', value: countByStatus('interested'), color: '#f59e0b' },
          { label: 'Convertidos', value: countByStatus('converted'), color: '#22c55e' },
        ].map((kpi) => (
          <div key={kpi.label} className="alp-kpi" style={{ borderTopColor: kpi.color }}>
            <span className="alp-kpi__value" style={{ color: kpi.color }}>{kpi.value}</span>
            <span className="alp-kpi__label">{kpi.label}</span>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="alp-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`alp-tab${activeTab === tab.value ? ' alp-tab--active' : ''}`}
            onClick={() => handleTabChange(tab.value as LeadStatus | '')}
          >
            {tab.label}
            {tab.value && <span className="alp-tab__count">{leads.filter((l) => l.status === tab.value).length}</span>}
          </button>
        ))}
      </div>

      {/* States */}
      {error && <div className="alp-state alp-state--error">⚠️ {error}</div>}
      {loading && <div className="alp-state"><div className="alp-spinner" /> Cargando leads...</div>}
      {!loading && leads.length === 0 && (
        <div className="alp-empty">
          <span className="alp-empty__icon">👤</span>
          <p className="alp-empty__text">Sin leads en este estado</p>
          <p className="alp-empty__sub">Agrega un nuevo lead para comenzar</p>
          <button className="alp-btn alp-btn--primary" onClick={() => setShowModal(true)}>+ Nuevo Lead</button>
        </div>
      )}

      {/* Leads list */}
      {!loading && leads.length > 0 && (
        <div className="alp-table-wrap">
          <table className="alp-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Fuente</th>
                <th>Interés</th>
                <th>Presupuesto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="alp-table-person">
                      <div className="alp-avatar" style={{ background: LEAD_STATUS_COLORS[lead.status] + '30', color: LEAD_STATUS_COLORS[lead.status] }}>
                        {initials(lead)}
                      </div>
                      <div>
                        <p className="alp-table-person__name">{lead.firstName} {lead.lastName}</p>
                        {lead.preferredCity && <p className="alp-table-person__city">📍 {lead.preferredCity}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="alp-contact">
                      {lead.phone && <span>📞 {lead.phone}</span>}
                      {lead.email && <span>✉ {lead.email}</span>}
                    </div>
                  </td>
                  <td><SourceBadge source={lead.source} /></td>
                  <td>
                    <div className="alp-interest">
                      {lead.operationType && <span>{OPERATION_TYPE_LABELS[lead.operationType as never] ?? lead.operationType}</span>}
                      {lead.propertyType && <span>{PROPERTY_TYPE_LABELS[lead.propertyType as never] ?? lead.propertyType}</span>}
                    </div>
                  </td>
                  <td>
                    {lead.budgetMin || lead.budgetMax
                      ? <span className="alp-budget">{lead.currency} {lead.budgetMin?.toLocaleString() ?? '0'} – {lead.budgetMax?.toLocaleString() ?? '∞'}</span>
                      : <span className="alp-muted">—</span>}
                  </td>
                  <td><StatusPill status={lead.status} /></td>
                  <td className="alp-muted alp-date">{new Date(lead.createdAt).toLocaleDateString('es-BO')}</td>
                  <td>
                    <div className="alp-actions">
                      <button className="alp-action-btn" title="Editar" onClick={() => { setEditLead(lead); setShowModal(true); }}>✏️</button>
                      {lead.status !== 'converted' && lead.status !== 'lost' && (
                        <select
                          className="alp-action-select"
                          value={lead.status}
                          onChange={(e) => { void handleStatusChange(lead, e.target.value as LeadStatus); }}
                        >
                          {STATUS_FLOW.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
                        </select>
                      )}
                      <button className="alp-action-btn alp-action-btn--danger" title="Eliminar" onClick={() => { void handleDelete(lead.id); }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LeadModal
          initial={editLead}
          onSave={handleSaved}
          onClose={() => { setShowModal(false); setEditLead(null); }}
        />
      )}
    </div>
  );
}
