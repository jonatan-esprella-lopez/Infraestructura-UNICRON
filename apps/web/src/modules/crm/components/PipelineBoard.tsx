import { LeadCard } from './LeadCard';
import { usePipeline } from '../hooks/usePipeline';
import './PipelineBoard.css';

export function PipelineBoard() {
  const columns = usePipeline();

  return (
    <div className="crm-pipeline-board">
      {columns.map((column) => (
        <section className="crm-pipeline-board__column" key={column.id}>
          <h3 className="crm-pipeline-board__title">{column.title}</h3>
          {column.leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </section>
      ))}
    </div>
  );
}
