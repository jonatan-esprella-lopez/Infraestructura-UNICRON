import { useState } from 'react';
import { useLeads } from '../../../hooks/use-leads';
import { leadService } from '../../../services/lead.service';
import type { Lead, LeadStatus } from '../../../types/lead.types';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '../../../types/lead.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '../../../constants/property-types.constant';
import './agent-clients-page.css';

const CLIENT_STATUSES: LeadStatus[] = ['interested', 'visit_scheduled', 'offer_sent', 'converted'];

function initials(lead: Lead) {
  return `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();
}

function statusColor(status: LeadStatus) { return LEAD_STATUS_COLORS[status]; }

type Tab = LeadStatus | 'all';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'all', label: 'Todos los clientes' },
  { value: 'interested', label: 'Interesados' },
  { value: 'visit_scheduled', label: 'Visita agendada' },
  { value: 'offer_sent', label: 'Oferta enviada' },
  { value: 'converted', label: 'Convertidos' },
];

export function AgentClientsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const { leads, total, loading, error, reload } = useLeads({ limit: 100 });

  const clients = leads.filter((l) => CLIENT_STATUSES.includes(l.status));
  const visible = tab === 'all' ? clients : clients.filter((l) => l.status === tab);

  const handleStatusChange = async (lead: Lead, status: LeadStatus) => {
    try {
      await leadService.update(lead.id, { status });
      reload();
    } catch { /* ignore */ }
  };

  return (
    <div className="acp">
      {/* Header */}
      <div className="acp-header">
        <div>
          <p className="acp-header__crumb">Proptech / Clientes</p>
          <h2 className="acp-header__title">Clientes Activos</h2>
          <p className="acp-header__sub">Leads en proceso activo de compra o alquiler</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="acp-summary">
        {CLIENT_STATUSES.map((s) => {
          const count = clients.filter((l) => l.status === s).length;
          return (
            <div key={s} className="acp-summary-card" style={{ borderLeftColor: statusColor(s) }}>
              <span className="acp-summary-card__count" style={{ color: statusColor(s) }}>{count}</span>
              <span className="acp-summary-card__label">{LEAD_STATUS_LABELS[s]}</span>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="acp-tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`acp-tab${tab === t.value ? ' acp-tab--active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
            <span className="acp-tab__count">
              {t.value === 'all' ? clients.length : clients.filter((l) => l.status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* States */}
      {error && <div className="acp-state acp-state--error">⚠️ {error}</div>}
      {loading && <div className="acp-state"><div className="acp-spinner" /> Cargando clientes...</div>}
      {!loading && visible.length === 0 && (
        <div className="acp-empty">
          <span className="acp-empty__icon">👥</span>
          <p className="acp-empty__text">Sin clientes en este estado</p>
          <p className="acp-empty__sub">Los leads que avancen en el proceso aparecerán aquí</p>
        </div>
      )}

      {/* Client cards */}
      {!loading && visible.length > 0 && (
        <div className="acp-grid">
          {visible.map((lead) => (
            <div key={lead.id} className="acp-card">
              <div className="acp-card__header">
                <div className="acp-avatar" style={{ background: statusColor(lead.status) + '20', color: statusColor(lead.status) }}>
                  {initials(lead)}
                </div>
                <div className="acp-card__info">
                  <h3 className="acp-card__name">{lead.firstName} {lead.lastName}</h3>
                  <span className="acp-card__source">{LEAD_SOURCE_LABELS[lead.source]}</span>
                </div>
                <span className="acp-status-pill" style={{ background: statusColor(lead.status) + '18', color: statusColor(lead.status) }}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </div>

              <div className="acp-card__details">
                {lead.phone && (
                  <div className="acp-detail">
                    <span className="acp-detail__icon">📞</span>
                    <span>{lead.phone}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="acp-detail">
                    <span className="acp-detail__icon">✉</span>
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.preferredCity && (
                  <div className="acp-detail">
                    <span className="acp-detail__icon">📍</span>
                    <span>{lead.preferredCity}</span>
                  </div>
                )}
              </div>

              {(lead.operationType || lead.propertyType || lead.budgetMin || lead.budgetMax) && (
                <div className="acp-card__preferences">
                  {lead.operationType && (
                    <span className="acp-tag">{OPERATION_TYPE_LABELS[lead.operationType as never] ?? lead.operationType}</span>
                  )}
                  {lead.propertyType && (
                    <span className="acp-tag">{PROPERTY_TYPE_LABELS[lead.propertyType as never] ?? lead.propertyType}</span>
                  )}
                  {(lead.budgetMin || lead.budgetMax) && (
                    <span className="acp-tag acp-tag--budget">
                      {lead.currency} {lead.budgetMin?.toLocaleString() ?? '0'} – {lead.budgetMax?.toLocaleString() ?? '∞'}
                    </span>
                  )}
                </div>
              )}

              {lead.notes && <p className="acp-card__notes">"{lead.notes}"</p>}

              <div className="acp-card__footer">
                <span className="acp-card__date">Desde {new Date(lead.createdAt).toLocaleDateString('es-BO')}</span>
                <div className="acp-card__actions">
                  {lead.status !== 'converted' && (
                    <select
                      className="acp-action-select"
                      value={lead.status}
                      onChange={(e) => { void handleStatusChange(lead, e.target.value as LeadStatus); }}
                    >
                      {CLIENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  )}
                  {lead.status === 'converted' && (
                    <span className="acp-converted-badge">✓ Convertido</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
