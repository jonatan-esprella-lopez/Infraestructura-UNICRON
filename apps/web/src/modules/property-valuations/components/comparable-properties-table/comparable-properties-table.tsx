import type { ComparableProperty } from "../../types/land-valuation.types";
import { formatCurrency } from "../../utils/format-currency.util";
import "./comparable-properties-table.css";

interface ComparablePropertiesTableProps {
  comparables: ComparableProperty[];
}

export function ComparablePropertiesTable({
  comparables,
}: ComparablePropertiesTableProps) {
  if (comparables.length === 0) {
    return (
      <div className="comparable-properties-table__empty">
        No se encontraron comparables suficientes para esta zona.
      </div>
    );
  }

  return (
    <section className="comparable-properties-table">
      <header className="comparable-properties-table__header">
        <h3 className="comparable-properties-table__title">
          Terrenos comparables
        </h3>
      </header>

      <div className="comparable-properties-table__scroll">
        <table className="comparable-properties-table__table">
          <thead>
            <tr>
              <th>Zona</th>
              <th>Superficie</th>
              <th>Precio</th>
              <th>Precio m²</th>
              <th>Similitud</th>
            </tr>
          </thead>

          <tbody>
            {comparables.map((item) => (
              <tr key={item.id}>
                <td>{item.zone}</td>
                <td>{item.surfaceM2} m²</td>
                <td>{formatCurrency(item.price, item.currency)}</td>
                <td>{formatCurrency(item.pricePerM2, item.currency)}</td>
                <td>{item.similarityScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
