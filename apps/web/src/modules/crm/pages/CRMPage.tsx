import { LeadTable } from '../components/LeadTable';
import { PipelineBoard } from '../components/PipelineBoard';
import { useFollowups } from '../hooks/useFollowups';
import { useLeads } from '../hooks/useLeads';

export function CRMPage() {
  const { leads, total } = useLeads();
  const followups = useFollowups();

  return (
    <section className="module-page">
      <div className="module-hero">
        <div>
          <p className="eyebrow">CRM enterprise</p>
          <h2>Pipeline comercial</h2>
          <p>Leads, scoring y seguimiento listos para adaptar a Quantum, VIVA o INTERSIM.</p>
        </div>
        <div className="hero-stat">
          <strong>{total}</strong>
          <span>{followups.nextAction}</span>
        </div>
      </div>
      <PipelineBoard />
      <div className="capability-panel">
        <h3>Leads priorizados</h3>
        <LeadTable leads={leads} />
      </div>
    </section>
  );
}
