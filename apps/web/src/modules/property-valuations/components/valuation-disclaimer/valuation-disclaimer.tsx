import "./valuation-disclaimer.css";

export function ValuationDisclaimer() {
  return (
    <div className="valuation-disclaimer">
      <p className="valuation-disclaimer__text">
        <strong>Aviso Legal:</strong> La estimación proporcionada por esta
        herramienta es un valor referencial aproximado, calculado en base a
        datos comparables del mercado y algoritmos de valuación automatizados.
        No constituye un avalúo comercial oficial ni vinculante. Para una
        tasación exacta y con validez legal o financiera, se recomienda
        solicitar el servicio de un perito valuador profesional y certificado.
      </p>
    </div>
  );
}
