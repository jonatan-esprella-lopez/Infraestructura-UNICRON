import { useState } from 'react';
import { useLeads } from '../../../hooks/use-leads';
import { leadService } from '../../../services/lead.service';
import {
  LEAD_STATUS_LABELS, LEAD_STATUS_COLORS,
  type Lead, type LeadStatus,
} from '../../../types/lead.types';
import './agent-matching-page.css';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Departamento', house: 'Casa', office: 'Oficina',
  land: 'Terreno', commercial: 'Local comercial', warehouse: 'Depósito',
};

const OPERATION_TYPE_LABELS: Record<string, string> = {
  sale: 'Venta', rent: 'Alquiler', anticresis: 'Anticresis',
};

const PIPELINE_STATUSES: LeadStatus[] = ['interested', 'visit_scheduled', 'offer_sent'];
const CLOSED_STATUSES: LeadStatus[] = ['converted'];
const LOST_STATUSES: LeadStatus[] = ['lost'];

type Tab = 'pipeline' | 'closed' | 'lost';

function waLink(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${clean.startsWith('591') ? clean : `591${clean}`}`;
}

function parseBudget(lead: Lead): string {
  if (!lead.budgetMin && !lead.budgetMax) return '—';
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
  const curr = lead.currency ?? 'USD';
  if (lead.budgetMin && lead.budgetMax) return `${curr} ${fmt(lead.budgetMin)} – ${fmt(lead.budgetMax)}`;
  if (lead.budgetMin) return `${curr} desde ${fmt(lead.budgetMin)}`;
  return `${curr} hasta ${fmt(lead.budgetMax!)}`;
}

function parseOwnerPhone(notes?: string): string | null {
  if (!notes) return null;
  const m = notes.match(/propietario[:\s]+([0-9\s\-+]{7,})/i);
  return m ? m[1].trim() : null;
}

interface MatchCardProps {
  lead: Lead;
  onConverted: (id: string) => Promise<void>;
  onLost: (id: string) => Promise<void>;
  saving: string | null;
}

function MatchCard({ lead, onConverted, onLost, saving }: MatchCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const ownerPhone = parseOwnerPhone(lead.notes);
  const isSaving = saving === lead.id;

  const fullName = `${lead.firstName} ${lead.lastName}`;
  const initials = `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();

  const propLabel = [
    lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] ?? lead.propertyType : null,
    lead.operationType ? OPERATION_TYPE_LABELS[lead.operationType] ?? lead.operationType : null,
  ].filter(Boolean).join(' en ');

  const statusColor = LEAD_STATUS_COLORS[lead.status];

  return (
    <div className="amp-card">
      {/* Status ribbon */}
      <div className="amp-card__ribbon" style={{ background: statusColor + '22', borderColor: statusColor + '55' }}>
        <span className="amp-card__status" style={{ background: statusColor + '20', color: statusColor }}>
          {LEAD_STATUS_LABELS[lead.status]}
        </span>
        <span className="amp-card__date">{new Date(lead.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>

      <div className="amp-card__body">
        {/* Client identity */}
        <div className="amp-card__identity">
          <div className="amp-card__avatar">{initials}</div>
          <div className="amp-card__client">
            <h3 className="amp-card__name">{fullName}</h3>
            {lead.email && <span className="amp-card__email">{lead.email}</span>}
          </div>
        </div>

        {/* What they're looking for */}
        <div className="amp-card__search">
          <p className="amp-card__search-title">Busca</p>
          <div className="amp-card__tags">
            {propLabel && <span className="amp-tag amp-tag--prop">{propLabel}</span>}
            {lead.preferredCity && <span className="amp-tag amp-tag--city">📍 {lead.preferredCity}</span>}
            {(lead.budgetMin || lead.budgetMax) && (
              <span className="amp-tag amp-tag--budget">💲 {parseBudget(lead)}</span>
            )}
            {lead.source && <span className="amp-tag amp-tag--source">{lead.source}</span>}
          </div>
        </div>

        {/* Contact buttons */}
        <div className="amp-card__contacts">
          <div className="amp-contact-group">
            <span className="amp-contact-label">Cliente</span>
            {lead.phone ? (
              <a
                href={waLink(lead.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="amp-contact-btn amp-contact-btn--client"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {lead.phone}
              </a>
            ) : (
              <span className="amp-contact-missing">Sin número</span>
            )}
          </div>

          {ownerPhone && (
            <div className="amp-contact-group">
              <span className="amp-contact-label">Propietario</span>
              <a
                href={waLink(ownerPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="amp-contact-btn amp-contact-btn--owner"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {ownerPhone}
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="amp-card__notes">
            <button className="amp-notes-toggle" onClick={() => setShowNotes((s) => !s)}>
              📝 Notas {showNotes ? '▴' : '▾'}
            </button>
            {showNotes && <p className="amp-notes-text">{lead.notes}</p>}
          </div>
        )}

        {/* Action buttons — only for active pipeline */}
        {PIPELINE_STATUSES.includes(lead.status) && (
          <div className="amp-card__actions">
            <button
              className="amp-action-btn amp-action-btn--won"
              onClick={() => { void onConverted(lead.id); }}
              disabled={isSaving}
            >
              {isSaving ? '…' : '✅'} Se cerró / Vendido
            </button>
            <button
              className="amp-action-btn amp-action-btn--lost"
              onClick={() => { void onLost(lead.id); }}
              disabled={isSaving}
            >
              {isSaving ? '…' : '❌'} No se cerró
            </button>
          </div>
        )}

        {/* Result badge for closed/lost */}
        {(CLOSED_STATUSES.includes(lead.status) || LOST_STATUSES.includes(lead.status)) && (
          <div className={`amp-result-badge ${CLOSED_STATUSES.includes(lead.status) ? 'amp-result-badge--won' : 'amp-result-badge--lost'}`}>
            {CLOSED_STATUSES.includes(lead.status) ? '✅ Vendido / Cerrado' : '❌ Cierre no logrado'}
            {lead.convertedAt && (
              <span className="amp-result-badge__date">
                {new Date(lead.convertedAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AgentMatchingPage() {
  const { leads, loading, error, reload } = useLeads();
  const [tab, setTab] = useState<Tab>('pipeline');
  const [saving, setSaving] = useState<string | null>(null);

  const pipeline = leads.filter((l) => PIPELINE_STATUSES.includes(l.status));
  const closed = leads.filter((l) => CLOSED_STATUSES.includes(l.status));
  const lost = leads.filter((l) => LOST_STATUSES.includes(l.status));

  const visible = tab === 'pipeline' ? pipeline : tab === 'closed' ? closed : lost;

  const handleConverted = async (id: string) => {
    setSaving(id);
    try { await leadService.update(id, { status: 'converted' }); reload(); } catch { /* ignore */ } finally { setSaving(null); }
  };

  const handleLost = async (id: string) => {
    if (!confirm('¿Confirmar que el cierre no se logró con este cliente?')) return;
    setSaving(id);
    try { await leadService.update(id, { status: 'lost' }); reload(); } catch { /* ignore */ } finally { setSaving(null); }
  };

  const TABS: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'pipeline', label: 'En pipeline', count: pipeline.length },
    { key: 'closed', label: 'Cerrados', count: closed.length },
    { key: 'lost', label: 'No cerrados', count: lost.length },
  ];

  return (
    <div className="amp">
      {/* Header */}
      <div className="amp-header">
        <div>
          <p className="amp-header__crumb">Proptech / Matching IA</p>
          <h2 className="amp-header__title">Pipeline de Matchings</h2>
          <p className="amp-header__sub">
            Clientes listos para avanzar. Contacta por WhatsApp y reporta el resultado del cierre.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="amp-kpis">
        <div className="amp-kpi" style={{ borderTopColor: '#3b82f6' }}>
          <span className="amp-kpi__value" style={{ color: '#3b82f6' }}>{pipeline.length}</span>
          <span className="amp-kpi__label">En pipeline</span>
        </div>
        <div className="amp-kpi" style={{ borderTopColor: '#22c55e' }}>
          <span className="amp-kpi__value" style={{ color: '#22c55e' }}>{closed.length}</span>
          <span className="amp-kpi__label">Cerrados</span>
        </div>
        <div className="amp-kpi" style={{ borderTopColor: '#ef4444' }}>
          <span className="amp-kpi__value" style={{ color: '#ef4444' }}>{lost.length}</span>
          <span className="amp-kpi__label">No cerrados</span>
        </div>
        <div className="amp-kpi" style={{ borderTopColor: '#8b5cf6' }}>
          <span className="amp-kpi__value" style={{ color: '#8b5cf6' }}>{leads.length}</span>
          <span className="amp-kpi__label">Total</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="amp-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`amp-tab${tab === t.key ? ' amp-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="amp-tab__count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* States */}
      {error && <div className="amp-state amp-state--error">⚠ {error}</div>}
      {loading && <div className="amp-state"><div className="amp-spinner" /> Cargando pipeline...</div>}

      {!loading && visible.length === 0 && (
        <div className="amp-empty">
          <span className="amp-empty__icon">
            {tab === 'pipeline' ? '🔍' : tab === 'closed' ? '🏆' : '📋'}
          </span>
          <p className="amp-empty__text">
            {tab === 'pipeline' ? 'No hay clientes en pipeline activo' :
              tab === 'closed' ? 'Sin cierres registrados aún' : 'Sin cierres caídos registrados'}
          </p>
          <p className="amp-empty__sub">
            {tab === 'pipeline' ? 'Los leads interesados aparecerán aquí' : ''}
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && visible.length > 0 && (
        <div className="amp-grid">
          {visible.map((lead) => (
            <MatchCard
              key={lead.id}
              lead={lead}
              onConverted={handleConverted}
              onLost={handleLost}
              saving={saving}
            />
          ))}
        </div>
      )}
    </div>
  );
}
