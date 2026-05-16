import { useState } from 'react';
import { useVisits, visitService } from '../../../hooks/use-visits';
import type { Visit, VisitStatus } from '../../../hooks/use-visits';
import './agent-visits-page.css';

const STATUS_LABELS: Record<VisitStatus, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
  rescheduled: 'Reprogramada',
};

const STATUS_COLORS: Record<VisitStatus, string> = {
  scheduled: '#3b82f6',
  confirmed: '#22c55e',
  completed: '#8b5cf6',
  cancelled: '#ef4444',
  no_show: '#f59e0b',
  rescheduled: '#64748b',
};

const TYPE_LABELS: Record<string, string> = {
  in_person: 'Presencial',
  virtual: 'Virtual',
};

const RESULT_OPTIONS = [
  { value: 'interested', label: 'Interesado' },
  { value: 'not_interested', label: 'No interesado' },
  { value: 'pending_decision', label: 'Decisión pendiente' },
  { value: 'offer_made', label: 'Oferta realizada' },
];

const STATUS_TABS: Array<{ value: VisitStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'scheduled', label: 'Programadas' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

interface CompleteModalProps {
  visitId: string;
  onDone: () => void;
  onClose: () => void;
}
function CompleteModal({ visitId, onDone, onClose }: CompleteModalProps) {
  const [result, setResult] = useState('interested');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await visitService.complete(visitId, result, feedback);
      onDone();
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <div className="avp-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="avp-modal">
        <div className="avp-modal__header">
          <h3 className="avp-modal__title">Completar visita</h3>
          <button className="avp-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="avp-modal__body">
          <div className="avp-form-group">
            <label className="avp-form-label">Resultado</label>
            <select className="avp-form-select" value={result} onChange={(e) => setResult(e.target.value)}>
              {RESULT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="avp-form-group">
            <label className="avp-form-label">Feedback del agente</label>
            <textarea className="avp-form-textarea" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="¿Cómo fue la visita?" />
          </div>
        </div>
        <div className="avp-modal__footer">
          <button className="avp-btn avp-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="avp-btn avp-btn--primary" onClick={() => { void submit(); }} disabled={saving}>
            {saving ? 'Guardando...' : 'Marcar completada'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AgentVisitsPage() {
  const { visits, loading, error, reload } = useVisits();
  const [tab, setTab] = useState<VisitStatus | 'all'>('all');
  const [completeVisitId, setCompleteVisitId] = useState<string | null>(null);

  const visible = tab === 'all' ? visits : visits.filter((v) => v.status === tab);

  const todayCount = visits.filter((v) => isToday(v.scheduledAt) && (v.status === 'scheduled' || v.status === 'confirmed')).length;
  const weekCount = visits.filter((v) => isThisWeek(v.scheduledAt) && v.status !== 'cancelled').length;
  const completedCount = visits.filter((v) => v.status === 'completed').length;
  const pendingCount = visits.filter((v) => v.status === 'scheduled').length;

  const handleConfirm = async (id: string) => {
    try { await visitService.confirm(id); reload(); } catch { /* ignore */ }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta visita?')) return;
    try { await visitService.cancel(id); reload(); } catch { /* ignore */ }
  };

  return (
    <div className="avp">
      {/* Header */}
      <div className="avp-header">
        <div>
          <p className="avp-header__crumb">Proptech / Visitas</p>
          <h2 className="avp-header__title">Control de Visitas</h2>
        </div>
      </div>

      {/* KPI summary */}
      <div className="avp-kpis">
        {[
          { label: 'Hoy', value: todayCount, icon: '📅', color: '#3b82f6' },
          { label: 'Esta semana', value: weekCount, icon: '📆', color: '#8b5cf6' },
          { label: 'Completadas', value: completedCount, icon: '✅', color: '#22c55e' },
          { label: 'Pendientes', value: pendingCount, icon: '⏳', color: '#f59e0b' },
        ].map((kpi) => (
          <div key={kpi.label} className="avp-kpi" style={{ borderTopColor: kpi.color }}>
            <div className="avp-kpi__top">
              <span className="avp-kpi__icon">{kpi.icon}</span>
              <span className="avp-kpi__value" style={{ color: kpi.color }}>{kpi.value}</span>
            </div>
            <span className="avp-kpi__label">{kpi.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="avp-tabs">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            className={`avp-tab${tab === t.value ? ' avp-tab--active' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
            <span className="avp-tab__count">
              {t.value === 'all' ? visits.length : visits.filter((v) => v.status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* States */}
      {error && <div className="avp-state avp-state--error">⚠️ {error}</div>}
      {loading && <div className="avp-state"><div className="avp-spinner" /> Cargando visitas...</div>}
      {!loading && visible.length === 0 && (
        <div className="avp-empty">
          <span className="avp-empty__icon">📋</span>
          <p className="avp-empty__text">Sin visitas en este estado</p>
          <p className="avp-empty__sub">Las visitas agendadas aparecerán aquí</p>
        </div>
      )}

      {/* Visits list */}
      {!loading && visible.length > 0 && (
        <div className="avp-list">
          {visible.map((visit) => {
            const today = isToday(visit.scheduledAt);
            const dt = new Date(visit.scheduledAt);
            return (
              <div key={visit.id} className={`avp-item${today ? ' avp-item--today' : ''}`}>
                {today && <div className="avp-item__today-tag">HOY</div>}
                <div className="avp-item__left">
                  <div className="avp-item__date">
                    <span className="avp-item__day">{dt.getDate()}</span>
                    <span className="avp-item__month">{dt.toLocaleString('es-BO', { month: 'short' })}</span>
                  </div>
                  <div className="avp-item__time">{dt.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div className="avp-item__body">
                  <div className="avp-item__row">
                    <span className="avp-item__prop-id">
                      🏠 Propiedad: <code>{visit.propertyId.slice(0, 8)}...</code>
                    </span>
                    <span className="avp-type-badge avp-type-badge--{visit.visitType}">
                      {visit.visitType === 'virtual' ? '💻' : '🚪'} {TYPE_LABELS[visit.visitType] ?? visit.visitType}
                    </span>
                  </div>
                  <div className="avp-item__row">
                    <span className="avp-item__client">
                      👤 Cliente: <code>{visit.clientId.slice(0, 8)}...</code>
                    </span>
                  </div>
                  {visit.notes && <p className="avp-item__notes">📝 {visit.notes}</p>}
                  {visit.result && (
                    <p className="avp-item__result">
                      Resultado: <strong>{RESULT_OPTIONS.find((o) => o.value === visit.result)?.label ?? visit.result}</strong>
                    </p>
                  )}
                  {visit.agentFeedback && <p className="avp-item__feedback">💬 {visit.agentFeedback}</p>}
                </div>

                <div className="avp-item__right">
                  <span
                    className="avp-status-badge"
                    style={{ background: STATUS_COLORS[visit.status] + '18', color: STATUS_COLORS[visit.status] }}
                  >
                    {STATUS_LABELS[visit.status]}
                  </span>
                  <div className="avp-item__actions">
                    {visit.status === 'scheduled' && (
                      <button className="avp-action-btn avp-action-btn--confirm" onClick={() => { void handleConfirm(visit.id); }}>
                        ✓ Confirmar
                      </button>
                    )}
                    {(visit.status === 'scheduled' || visit.status === 'confirmed') && (
                      <button className="avp-action-btn avp-action-btn--complete" onClick={() => setCompleteVisitId(visit.id)}>
                        ✔ Completar
                      </button>
                    )}
                    {(visit.status === 'scheduled' || visit.status === 'confirmed') && (
                      <button className="avp-action-btn avp-action-btn--cancel" onClick={() => { void handleCancel(visit.id); }}>
                        ✕ Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete modal */}
      {completeVisitId && (
        <CompleteModal
          visitId={completeVisitId}
          onDone={() => { setCompleteVisitId(null); reload(); }}
          onClose={() => setCompleteVisitId(null)}
        />
      )}
    </div>
  );
}
