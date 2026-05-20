import { useState, useEffect } from 'react';
import { useLeads } from '../../../hooks/use-leads';
import { leadService } from '../../../services/lead.service';
import type { Lead, LeadStatus, LeadSource, CreateLeadPayload } from '../../../types/lead.types';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '../../../types/lead.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../../constants/property-types.constant';
import './agent-leads-page.css';

const PIPELINE: LeadStatus[] = ['new', 'contacted', 'interested', 'visit_scheduled', 'offer_sent', 'converted', 'lost'];

function initials(lead: Lead) {
  return `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();
}

function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('591') ? digits : '591' + digits}`;
}

const EMPTY_FORM: CreateLeadPayload = {
  firstName: '', lastName: '', email: '', phone: '',
  source: 'manual', status: 'new', operationType: '',
  propertyType: '', budgetMin: undefined, budgetMax: undefined,
  currency: 'BOB', preferredCity: '', notes: '',
};

interface LeadModalProps {
  initial?: Lead | null;
  defaultStatus?: LeadStatus;
  onSave: () => void;
  onClose: () => void;
}

function LeadModal({ initial, defaultStatus = 'new', onSave, onClose }: LeadModalProps) {
  const [form, setForm] = useState<CreateLeadPayload>(
    initial
      ? {
          firstName: initial.firstName, lastName: initial.lastName, email: initial.email,
          phone: initial.phone, source: initial.source, status: initial.status,
          operationType: initial.operationType, propertyType: initial.propertyType,
          budgetMin: initial.budgetMin, budgetMax: initial.budgetMax, currency: initial.currency,
          preferredCity: initial.preferredCity, notes: initial.notes,
        }
      : { ...EMPTY_FORM, status: defaultStatus },
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) { setErr('Nombre y apellido son requeridos'); return; }
    setSaving(true); setErr('');
    try {
      if (initial) await leadService.update(initial.id, form);
      else await leadService.create(form);
      onSave();
    } catch { setErr('Error al guardar. Intenta nuevamente.'); }
    finally { setSaving(false); }
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
                <input className="alp-form-input" value={form.firstName} onChange={(e) => f('firstName', e.target.value)} placeholder="Carlos" required />
              </div>
              <div className="alp-form-group">
                <label className="alp-form-label">Apellido *</label>
                <input className="alp-form-input" value={form.lastName} onChange={(e) => f('lastName', e.target.value)} placeholder="Mamani" required />
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
                  {PIPELINE.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
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

export function AgentLeadsPage() {
  const { leads: rawLeads, total, loading, error, reload } = useLeads({ limit: 100 });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropCol, setDropCol] = useState<LeadStatus | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus>('new');

  useEffect(() => { setLeads(rawLeads); }, [rawLeads]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragId(lead.id);
  };

  const handleDragEnd = () => { setDragId(null); setDropCol(null); };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropCol(status);
  };

  const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const id = dragId;
    setDragId(null);
    setDropCol(null);
    if (!id) return;
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    setLeads((ls) => ls.map((l) => l.id === id ? { ...l, status } : l));
    try { await leadService.update(id, { status }); }
    catch { reload(); }
  };

  const openCreate = (status: LeadStatus) => { setNewLeadStatus(status); setEditLead(null); setShowModal(true); };
  const openEdit = (lead: Lead) => { setEditLead(lead); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este lead?')) return;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    try { await leadService.delete(id); }
    catch { reload(); }
  };

  const handleSaved = () => { setShowModal(false); setEditLead(null); reload(); };

  const kpis = [
    { label: 'Total', value: total, color: '#1e3a8a' },
    { label: 'Nuevos', value: leads.filter((l) => l.status === 'new').length, color: '#3b82f6' },
    { label: 'Interesados', value: leads.filter((l) => l.status === 'interested').length, color: '#f59e0b' },
    { label: 'Convertidos', value: leads.filter((l) => l.status === 'converted').length, color: '#22c55e' },
  ];

  return (
    <div className="alp">
      <div className="alp-header">
        <div>
          <p className="alp-header__crumb">Proptech / Leads</p>
          <h2 className="alp-header__title">Gestión de Leads</h2>
        </div>
        <button className="alp-btn alp-btn--primary" onClick={() => openCreate('new')}>
          + Nuevo Lead
        </button>
      </div>

      <div className="alp-kpis">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="alp-kpi" style={{ borderTopColor: kpi.color }}>
            <span className="alp-kpi__value" style={{ color: kpi.color }}>{kpi.value}</span>
            <span className="alp-kpi__label">{kpi.label}</span>
          </div>
        ))}
      </div>

      {error && <div className="alp-state alp-state--error">⚠️ {error}</div>}
      {loading && <div className="alp-state"><div className="alp-spinner" /> Cargando leads...</div>}

      {!loading && (
        <div className="alp-board">
          {PIPELINE.map((status) => {
            const color = LEAD_STATUS_COLORS[status];
            const colLeads = leads.filter((l) => l.status === status);
            const isOver = dropCol === status && dragId !== null;

            return (
              <div
                key={status}
                className={`alp-col${isOver ? ' alp-col--over' : ''}`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDrop={(e) => { void handleDrop(e, status); }}
              >
                <div className="alp-col__header" style={{ borderTopColor: color }}>
                  <div className="alp-col__title-row">
                    <span className="alp-col__dot" style={{ background: color }} />
                    <span className="alp-col__label">{LEAD_STATUS_LABELS[status]}</span>
                    <span className="alp-col__count" style={{ background: color + '22', color }}>
                      {colLeads.length}
                    </span>
                  </div>
                  <button className="alp-col__add" onClick={() => openCreate(status)} title="Nuevo lead">+</button>
                </div>

                <div className="alp-col__body">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`alp-card${dragId === lead.id ? ' alp-card--dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="alp-card__head">
                        <div className="alp-card__avatar" style={{ background: color + '20', color }}>
                          {initials(lead)}
                        </div>
                        <div className="alp-card__meta">
                          <p className="alp-card__name">{lead.firstName} {lead.lastName}</p>
                          <span className="alp-card__source">{LEAD_SOURCE_LABELS[lead.source]}</span>
                        </div>
                        <div className="alp-card__btns">
                          <button
                            className="alp-card__btn"
                            title="Editar"
                            onClick={(e) => { e.stopPropagation(); openEdit(lead); }}
                          >✏️</button>
                          <button
                            className="alp-card__btn"
                            title="Eliminar"
                            onClick={(e) => { e.stopPropagation(); void handleDelete(lead.id); }}
                          >🗑</button>
                        </div>
                      </div>

<<<<<<< HEAD
                      {lead.propertyTitle && (
                        <p className="alp-card__property">
                          🏠 {lead.propertyTitle}
                        </p>
                      )}

=======
>>>>>>> origin/exp/pres
                      {(lead.operationType || lead.propertyType || lead.preferredCity) && (
                        <div className="alp-card__tags">
                          {lead.operationType && (
                            <span className="alp-tag alp-tag--op">
                              {OPERATION_TYPE_LABELS[lead.operationType as never] ?? lead.operationType}
                            </span>
                          )}
                          {lead.propertyType && (
                            <span className="alp-tag alp-tag--pt">
                              {PROPERTY_TYPE_LABELS[lead.propertyType as never] ?? lead.propertyType}
                            </span>
                          )}
                          {lead.preferredCity && (
                            <span className="alp-tag alp-tag--city">📍 {lead.preferredCity}</span>
                          )}
                        </div>
                      )}

                      {(lead.budgetMin != null || lead.budgetMax != null) && (
                        <p className="alp-card__budget">
                          {lead.currency} {lead.budgetMin?.toLocaleString('es-BO') ?? '0'} – {lead.budgetMax?.toLocaleString('es-BO') ?? '∞'}
                        </p>
                      )}

                      {lead.phone && (
                        <a
                          className="alp-card__wa"
                          href={waLink(lead.phone)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📱 {lead.phone}
                        </a>
                      )}

                      <p className="alp-card__date">
                        {new Date(lead.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="alp-col__empty">Arrastra leads aquí</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <LeadModal
          initial={editLead}
          defaultStatus={newLeadStatus}
          onSave={handleSaved}
          onClose={() => { setShowModal(false); setEditLead(null); }}
        />
      )}
    </div>
  );
}
