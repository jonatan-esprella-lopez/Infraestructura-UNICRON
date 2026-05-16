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
    <section className="agent-land-valuation-page">
      <header className="agent-land-valuation-page__header">
        <div>
          <p className="agent-land-valuation-page__eyebrow">
            Herramienta para agentes
          </p>

          <h1 className="agent-land-valuation-page__title">
            Estimador de valor de terrenos
          </h1>

          <p className="agent-land-valuation-page__description">
            Calcula un rango estimado del valor comercial de un terreno usando
            precio por metro cuadrado, ubicación, servicios, documentación y
            comparables de mercado.
          </p>
        </div>
      </header>

      <div className="agent-land-valuation-page__layout">
        <div className="agent-land-valuation-page__form-panel">
          <ValuationForm
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onReset={reset}
          />
        </div>

        <div className="agent-land-valuation-page__result-panel">
          {error && (
            <div className="agent-land-valuation-page__error">{error}</div>
          )}

          {!result && !isLoading && !error && (
            <div className="agent-land-valuation-page__empty">
              Ingresa los datos del terreno para generar una estimación.
            </div>
          )}

          {isLoading && (
            <div className="agent-land-valuation-page__loading">
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
