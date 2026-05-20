<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import {
  UserRoundSearch, Star, ShieldCheck, Search, Loader2,
  Phone, Mail, Home, Building2, X, CheckCircle2, AlertCircle,
  MapPin, ChevronRight, UserCheck,
} from 'lucide-react';
import { environment } from '@bootstrap/environment';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property } from '@modules/proptech/types/property.types';
=======
import { useState, useEffect } from 'react';
import { UserRoundSearch, Star, CheckCircle2, ShieldCheck, Search, Filter, Loader2 } from 'lucide-react';
import { environment } from '@bootstrap/environment';
>>>>>>> origin/exp/pres
import './agents-marketplace-page.css';

interface Agent {
  id: string;
  name: string;
  agency: string;
<<<<<<< HEAD
  email: string;
  phone: string;
  rating: string;
=======
  rating: string | number;
>>>>>>> origin/exp/pres
  reviews: number;
  activeListings: number;
  soldListings: number;
  verified: boolean;
  avatar: string;
}

<<<<<<< HEAD
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: 'Casa', apartment: 'Departamento', land: 'Terreno',
  office: 'Oficina', commercial: 'Comercial', warehouse: 'Almacén', parking: 'Estacionamiento',
};

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('intersim.token');
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

/* ── Assignment Modal ─────────────────────────────────────────────────── */
interface AssignModalProps {
  agent: Agent;
  onClose: () => void;
  onSuccess: () => void;
}

function AssignModal({ agent, onClose, onSuccess }: AssignModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: number; fail: number } | null>(null);

  useEffect(() => {
    propertyService.findAll({ limit: 100, offset: 0 })
      .then((res) => setProperties(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleConfirm = async () => {
    if (selected.size === 0) return;
    setSaving(true);
    let ok = 0, fail = 0;
    for (const propId of selected) {
      try {
        await fetch(`${environment.apiBaseUrl}/v1/proptech/properties/${propId}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ agentId: agent.id }),
        });
        ok++;
      } catch {
        fail++;
      }
    }
    setSaving(false);
    setResult({ ok, fail });
    if (ok > 0) setTimeout(() => { onSuccess(); onClose(); }, 1800);
  };

  const grouped = {
    unassigned: properties.filter((p) => !p.agentId),
    assigned: properties.filter((p) => p.agentId && p.agentId !== agent.id),
    thisAgent: properties.filter((p) => p.agentId === agent.id),
  };

  return (
    <div className="am-modal-backdrop" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <div className="am-modal-agent">
            <img src={agent.avatar} alt={agent.name} className="am-modal-avatar" />
            <div>
              <div className="am-modal-agent-name">{agent.name}</div>
              <div className="am-modal-agent-agency">{agent.agency}</div>
            </div>
          </div>
          <button className="am-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="am-modal-subtitle">
          Selecciona las propiedades que deseas asignar a este agente
        </div>

        {loading ? (
          <div className="am-modal-loading"><Loader2 className="am-spinner" size={28} /> Cargando propiedades...</div>
        ) : properties.length === 0 ? (
          <div className="am-modal-empty">
            <Home size={40} />
            <p>No tienes propiedades registradas aún.</p>
          </div>
        ) : (
          <div className="am-modal-body">
            {grouped.thisAgent.length > 0 && (
              <div className="am-prop-group">
                <div className="am-prop-group-label am-prop-group-label--current">
                  <CheckCircle2 size={14} /> Ya asignadas a {agent.name}
                </div>
                {grouped.thisAgent.map((p) => (
                  <PropertyRow key={p.id} prop={p} checked={selected.has(p.id)} onChange={toggle} disabled />
                ))}
              </div>
            )}

            {grouped.unassigned.length > 0 && (
              <div className="am-prop-group">
                <div className="am-prop-group-label">Sin agente asignado</div>
                {grouped.unassigned.map((p) => (
                  <PropertyRow key={p.id} prop={p} checked={selected.has(p.id)} onChange={toggle} />
                ))}
              </div>
            )}

            {grouped.assigned.length > 0 && (
              <div className="am-prop-group">
                <div className="am-prop-group-label am-prop-group-label--warn">Con otro agente (se reasignará)</div>
                {grouped.assigned.map((p) => (
                  <PropertyRow key={p.id} prop={p} checked={selected.has(p.id)} onChange={toggle} />
                ))}
              </div>
            )}
          </div>
        )}

        {result && (
          <div className={`am-modal-result ${result.fail > 0 ? 'am-result--warn' : 'am-result--ok'}`}>
            {result.fail === 0
              ? <><CheckCircle2 size={16} /> {result.ok} propiedad{result.ok !== 1 ? 'es' : ''} asignada{result.ok !== 1 ? 's' : ''} correctamente</>
              : <><AlertCircle size={16} /> {result.ok} asignadas, {result.fail} fallaron</>
            }
          </div>
        )}

        <div className="am-modal-footer">
          <button className="am-btn am-btn--ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <button
            className="am-btn am-btn--primary"
            onClick={handleConfirm}
            disabled={selected.size === 0 || saving || !!result}
          >
            {saving
              ? <><Loader2 className="am-spinner" size={16} /> Asignando...</>
              : <><UserCheck size={16} /> Asignar {selected.size > 0 ? `(${selected.size})` : ''}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ prop, checked, onChange, disabled = false }: {
  prop: Property; checked: boolean; onChange: (id: string) => void; disabled?: boolean;
}) {
  const typeLabel = PROPERTY_TYPE_LABELS[prop.propertyType] ?? prop.propertyType;
  return (
    <label className={`am-prop-row ${disabled ? 'am-prop-row--disabled' : ''} ${checked ? 'am-prop-row--checked' : ''}`}>
      <input
        type="checkbox"
        className="am-prop-check"
        checked={checked || disabled}
        disabled={disabled}
        onChange={() => !disabled && onChange(prop.id)}
      />
      <div className="am-prop-row-info">
        <div className="am-prop-row-title">{prop.title}</div>
        <div className="am-prop-row-meta">
          <span>{typeLabel}</span>
          <span><MapPin size={11} /> {prop.address}, {prop.city}</span>
        </div>
      </div>
      {prop.agentId && !disabled && (
        <span className="am-prop-row-warn">Reasignar</span>
      )}
    </label>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────── */
=======
>>>>>>> origin/exp/pres
export function AgentsMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${environment.apiBaseUrl}/v1/users/agents`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAgents(data?.data?.items ?? []);
      }
    } catch {
      /* no-op */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents, refreshKey]);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.agency ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="am-page">
      {selectedAgent && (
        <AssignModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}

      <header className="am-header">
        <div className="am-header-left">
          <div className="am-header-icon"><UserRoundSearch size={24} /></div>
          <div>
            <h1 className="am-header-title">Agentes disponibles</h1>
            <p className="am-header-sub">
              {loading ? 'Cargando...' : `${agents.length} agente${agents.length !== 1 ? 's' : ''} registrado${agents.length !== 1 ? 's' : ''} — selecciona uno para asignar tus propiedades`}
            </p>
=======

  useEffect(() => {
    async function fetchAgents() {
      try {
        const token = localStorage.getItem('intersim.token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${environment.apiBaseUrl}/v1/users/agents`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            setAgents(data.items);
          }
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agent.agency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marketplace-page">
      <header className="marketplace-header">
        <div className="marketplace-title-wrapper">
          <UserRoundSearch size={32} className="marketplace-icon" />
          <div>
            <h1 className="text-2xl font-bold">Marketplace de Agentes</h1>
            <p className="text-gray-500">Encuentra al agente inmobiliario ideal para comercializar tus propiedades</p>
>>>>>>> origin/exp/pres
          </div>
        </div>
      </header>

<<<<<<< HEAD
      <div className="am-controls">
        <div className="am-search">
          <Search size={17} className="am-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o agencia..."
=======
      <div className="marketplace-controls">
        <div className="marketplace-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o agencia..." 
>>>>>>> origin/exp/pres
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
<<<<<<< HEAD
      </div>

      {loading ? (
        <div className="am-state">
          <Loader2 className="am-spinner" size={36} />
          <span>Cargando agentes...</span>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="am-state">
          <UserRoundSearch size={48} opacity={0.3} />
          <p>No se encontraron agentes{searchTerm ? ` para "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <div className="am-grid">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onAssign={() => setSelectedAgent(agent)} />
=======
        <button className="marketplace-filter-btn">
          <Filter size={18} /> Filtrar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-500">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-3">Cargando agentes...</span>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-gray-500">
          <p>No se encontraron agentes que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div className="agent-card-header">
                <img src={agent.avatar} alt={agent.name} className="agent-avatar" />
                <div className="agent-info">
                  <h3 className="agent-name">
                    {agent.name}
                    {agent.verified && <ShieldCheck size={16} className="text-blue-500" aria-label="Agente Verificado" />}
                  </h3>
                  <span className="agent-agency">{agent.agency}</span>
                </div>
              </div>
              
              <div className="agent-stats">
                <div className="stat-box">
                  <span className="stat-value flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" /> {agent.rating}
                  </span>
                  <span className="stat-label">{agent.reviews} reseñas</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{agent.activeListings}</span>
                  <span className="stat-label">Activas</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{agent.soldListings}</span>
                  <span className="stat-label">Vendidas</span>
                </div>
              </div>

              <button className="agent-action-btn">
                Contactar Agente
              </button>
            </div>
>>>>>>> origin/exp/pres
          ))}
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD

/* ── Agent Card ───────────────────────────────────────────────────────── */
function AgentCard({ agent, onAssign }: { agent: Agent; onAssign: () => void }) {
  const rating = parseFloat(String(agent.rating));

  return (
    <div className="am-agent-card">
      <div className="am-agent-top">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="am-agent-avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=6366f1&color=fff&size=128`;
          }}
        />
        <div className="am-agent-identity">
          <div className="am-agent-name">
            {agent.name}
            {agent.verified && <ShieldCheck size={15} className="am-verified-icon" />}
          </div>
          <div className="am-agent-agency">
            <Building2 size={13} />
            {agent.agency || 'Agente Independiente'}
          </div>
          <div className="am-agent-rating">
            <Star size={13} className="am-star" />
            <span>{isNaN(rating) ? '4.5' : rating.toFixed(1)}</span>
            <span className="am-rating-count">({agent.reviews} reseñas)</span>
          </div>
        </div>
      </div>

      <div className="am-agent-stats">
        <div className="am-stat">
          <span className="am-stat-val">{agent.activeListings}</span>
          <span className="am-stat-lbl">Activas</span>
        </div>
        <div className="am-stat-divider" />
        <div className="am-stat">
          <span className="am-stat-val">{agent.soldListings}</span>
          <span className="am-stat-lbl">Vendidas</span>
        </div>
        <div className="am-stat-divider" />
        <div className="am-stat">
          <span className="am-stat-val">{agent.activeListings + agent.soldListings}</span>
          <span className="am-stat-lbl">Total</span>
        </div>
      </div>

      <div className="am-agent-contact">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="am-contact-item">
            <Phone size={14} /> {agent.phone}
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="am-contact-item">
            <Mail size={14} /> {agent.email}
          </a>
        )}
      </div>

      <button className="am-assign-btn" onClick={onAssign}>
        <UserCheck size={16} />
        Asignar a propiedad
        <ChevronRight size={15} className="am-assign-chevron" />
      </button>
    </div>
  );
}
=======
>>>>>>> origin/exp/pres
