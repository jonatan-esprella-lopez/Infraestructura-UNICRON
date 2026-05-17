import { useState } from 'react';
import { UserRoundSearch, Star, CheckCircle2, ShieldCheck, Search, Filter } from 'lucide-react';
import './agents-marketplace-page.css';

const MOCK_AGENTS = [
  { id: 1, name: 'Carlos Mendoza', agency: 'Century 21', rating: 4.9, reviews: 124, activeListings: 15, soldListings: 89, verified: true, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 2, name: 'Laura Vargas', agency: 'RE/MAX', rating: 4.8, reviews: 98, activeListings: 22, soldListings: 110, verified: true, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 3, name: 'Diego Torres', agency: 'Independiente', rating: 4.5, reviews: 45, activeListings: 5, soldListings: 32, verified: false, avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
  { id: 4, name: 'Ana Silva', agency: 'Keller Williams', rating: 5.0, reviews: 210, activeListings: 35, soldListings: 240, verified: true, avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
];

export function AgentsMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = MOCK_AGENTS.filter(agent => 
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

      <div className="marketplace-grid">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <img src={agent.avatar} alt={agent.name} className="agent-avatar" />
              <div className="agent-info">
                <h3 className="agent-name">
                  {agent.name}
                  {agent.verified && <ShieldCheck size={16} className="text-blue-500" title="Agente Verificado" />}
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
    </div>
  );
}
