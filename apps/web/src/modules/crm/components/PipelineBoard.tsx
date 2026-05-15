import { LeadCard } from './LeadCard';
import { usePipeline } from '../hooks/usePipeline';

export function PipelineBoard() {
  const columns = usePipeline();

  return (
    <div className="pipeline-board">
      {columns.map((column) => (
        <section className="pipeline-column" key={column.id}>
          <h3>{column.title}</h3>
          {column.leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </section>
      ))}
    </div>
  );
}
