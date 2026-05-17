import { BarChart3, Building2, Calculator, MapPin, Zap } from 'lucide-react';
import { useLandValuation } from "../../hooks/use-land-valuation";
import { ValuationForm } from "../../components/valuation-form/valuation-form";
import { ValuationResultCard } from "../../components/valuation-result-card/valuation-result-card";
import { ValuationFactorList } from "../../components/valuation-factor-list/valuation-factor-list";
import { ComparablePropertiesTable } from "../../components/comparable-properties-table/comparable-properties-table";
import { ValuationDisclaimer } from "../../components/valuation-disclaimer/valuation-disclaimer";
import type { LandValuationInput } from "../../types/land-valuation.types";
import "./agent-land-valuation-page.css";

export function AgentLandValuationPage() {
  const { result, isLoading, error, estimate, reset } = useLandValuation();

  const handleSubmit = async (input: LandValuationInput) => {
    await estimate(input);
  };

  return (
    <section className="alv">
      <header className="alv__header">
        <div className="alv__header-inner">
          <div>
            <p className="alv__eyebrow">
              <BarChart3 size={13} />
              Herramienta de valoración
            </p>
            <h1 className="alv__title">Estimador de valor de terrenos</h1>
            <p className="alv__desc">
              Calcula un rango estimado del valor comercial de un terreno usando
              precio por metro cuadrado, ubicación, servicios, documentación y
              comparables de mercado.
            </p>
          </div>
          <div className="alv__header-stats">
            <div className="alv__stat">
              <strong>3</strong>
              <span>ciudades</span>
            </div>
            <div className="alv__stat">
              <strong>8+</strong>
              <span>variables</span>
            </div>
            <div className="alv__stat">
              <strong>100%</strong>
              <span>gratuito</span>
            </div>
          </div>
        </div>
      </header>

      <div className="alv__layout">
        <div className="alv__form-panel">
          <ValuationForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onReset={reset}
          />
        </div>

        <div className="alv__result-panel">
          {error && (
            <div className="alv__error">{error}</div>
          )}

          {!result && !isLoading && !error && (
            <div className="alv__empty">
              <Building2 size={48} className="alv__empty-icon" />
              <strong>Listo para calcular</strong>
              <span>Ingresa los datos del terreno en el formulario<br />y presiona «Calcular valor» para obtener la estimación.</span>
            </div>
          )}

          {isLoading && (
            <div className="alv__loading">
              <div className="alv__loading-spinner" />
              Calculando estimación...
            </div>
          )}

          {result && (
            <>
              <ValuationResultCard result={result} />
              <ValuationFactorList factors={result.appliedFactors} />
              <ComparablePropertiesTable
                comparables={result.comparableProperties}
              />
              <ValuationDisclaimer />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
