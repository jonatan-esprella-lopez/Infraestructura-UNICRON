import { LeadTable } from '../components/LeadTable';
import { PipelineBoard } from '../components/PipelineBoard';
import { useFollowups } from '../hooks/useFollowups';
import { useLeads } from '../hooks/useLeads';
import './CRMPage.css';

export function CRMPage() {
  const { leads, total } = useLeads();
  const followups = useFollowups();

  return (
    <section className="crm-page">
      <div className="crm-page__hero">
        <div>
          <p className="crm-page__eyebrow">CRM enterprise</p>
          <h2 className="crm-page__title">Pipeline comercial</h2>
          <p className="crm-page__description">
            Leads, scoring y seguimiento listos para adaptar a Quantum, VIVA o INTERSIM.
          </p>
        </div>
        <div className="crm-page__stat">
          <strong className="crm-page__stat-value">{total}</strong>
          <span>{followups.nextAction}</span>
        </div>
      </div>
      <PipelineBoard />
      <div className="crm-page__panel">
        <h3>Leads priorizados</h3>
        <LeadTable leads={leads} />
      </div>
    </section>
  );
}
