import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import './ModuleOverviewPage.css';

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
    <section className="module-overview">
      <div className="module-overview__hero">
        <div>
          <p className="module-overview__eyebrow">Feature-driven domain</p>
          <h2 className="module-overview__title">{title}</h2>
          <p className="module-overview__description">{description}</p>
        </div>
        <Button>Crear registro</Button>
      </div>

      <div className="module-overview__metrics">
        {metrics.map((metric) => (
          <article className="module-overview__metric-card" key={metric.label}>
            <span className="module-overview__metric-label">{metric.label}</span>
            <strong className="module-overview__metric-value">{metric.value}</strong>
            <small className="module-overview__metric-trend">{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="module-overview__capabilities">
        <h3>Capacidades listas</h3>
        <div className="module-overview__summary">
          {capabilities.map((capability) => (
            <Badge key={capability}>{capability}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
