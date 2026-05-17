import { useState, useEffect } from 'react';
import { UserRoundSearch, Star, CheckCircle2, ShieldCheck, Search, Filter, Loader2 } from 'lucide-react';
import { environment } from '@bootstrap/environment';
import './agents-marketplace-page.css';

interface Agent {
  id: string;
  name: string;
  agency: string;
  rating: string | number;
  reviews: number;
  activeListings: number;
  soldListings: number;
  verified: boolean;
  avatar: string;
}

export function AgentsMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

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
          </div>
        </div>
      </header>

      <div className="marketplace-controls">
        <div className="marketplace-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o agencia..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
          ))}
        </div>
      )}
    </div>
  );
}
