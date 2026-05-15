import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';

interface ModuleMetric {
  label: string;
  value: string;
  trend: string;
}

interface ModuleOverviewPageProps {
  title: string;
  description: string;
  capabilities: string[];
  metrics: ModuleMetric[];
}

export function ModuleOverviewPage({ title, description, capabilities, metrics }: ModuleOverviewPageProps) {
  return (
    <section className="module-page">
      <div className="module-hero">
        <div>
          <p className="eyebrow">Feature-driven domain</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Button>Crear registro</Button>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="capability-panel">
        <h3>Capacidades listas</h3>
        <div className="module-summary">
          {capabilities.map((capability) => (
            <Badge key={capability}>{capability}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
