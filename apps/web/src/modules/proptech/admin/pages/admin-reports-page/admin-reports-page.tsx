import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../../../services/report.service';
import type {
  SalesTotalReport,
  ByPaymentMethodReport,
  ByLocationReport,
  ByAgentReport,
  ByPeriodReport,
} from '../../../types/sale.types';
import { PAYMENT_METHOD_LABELS, SALE_LOCATION_LABELS } from '../../../types/sale.types';
import './admin-reports-page.css';

export function AdminReportsPage() {
  const [total, setTotal] = useState<SalesTotalReport | null>(null);
  const [byMethod, setByMethod] = useState<ByPaymentMethodReport[]>([]);
  const [byLocation, setByLocation] = useState<ByLocationReport[]>([]);
  const [byAgent, setByAgent] = useState<ByAgentReport[]>([]);
  const [byPeriod, setByPeriod] = useState<ByPeriodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const filters = {
      from: from || undefined,
      to: to || undefined,
    };
    try {
      const [t, m, l, a, p] = await Promise.all([
        reportService.salesTotal(filters),
        reportService.byPaymentMethod(filters),
        reportService.byLocation(filters),
        reportService.byAgent(filters),
        reportService.byPeriod({ ...filters, granularity: 'month' }),
      ]);
      setTotal(t);
      setByMethod(m);
      setByLocation(l);
      setByAgent(a);
      setByPeriod(p);
    } catch {
      setError('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="admin-reports-page">
      <div className="reports-header">
        <div>
          <h1>Reportes de Ventas</h1>
          <p className="reports-subtitle">Análisis de ingresos y conversiones</p>
        </div>
        <div className="reports-filters">
          <label>
            Desde
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Hasta
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button className="btn-filter" onClick={() => { void load(); }}>Aplicar</button>
        </div>
      </div>

      {error && <div className="reports-error">{error}</div>}

      {loading ? (
        <div className="reports-loading">Cargando reportes...</div>
      ) : (
        <>
          {total && (
            <div className="summary-cards">
              <div className="summary-card highlight">
                <span className="summary-label">Total recaudado</span>
                <span className="summary-value">{total.total.toLocaleString('es-BO')} {total.currency}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Transacciones</span>
                <span className="summary-value">{total.count}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Ticket promedio</span>
                <span className="summary-value">{total.average.toLocaleString('es-BO', { maximumFractionDigits: 0 })} {total.currency}</span>
              </div>
            </div>
          )}

          <div className="reports-grid">
            <div className="report-section">
              <h2>Por método de pago</h2>
              {byMethod.length === 0 ? (
                <p className="empty-state">Sin datos</p>
              ) : (
                <div className="bar-list">
                  {byMethod.map((item) => (
                    <div key={item.method} className="bar-item">
                      <div className="bar-label">
                        <span>{PAYMENT_METHOD_LABELS[item.method]}</span>
                        <span className="bar-pct">{item.percentage}%</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="bar-amount">{item.total.toLocaleString('es-BO')} · {item.count} ventas</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="report-section">
              <h2>Por lugar de venta</h2>
              {byLocation.length === 0 ? (
                <p className="empty-state">Sin datos</p>
              ) : (
                <div className="bar-list">
                  {byLocation.map((item) => (
                    <div key={item.location} className="bar-item">
                      <div className="bar-label">
                        <span>{SALE_LOCATION_LABELS[item.location]}</span>
                        <span className="bar-pct">{item.percentage}%</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill bar-fill--green" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="bar-amount">{item.total.toLocaleString('es-BO')} · {item.count} ventas</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="report-section">
              <h2>Por período (mensual)</h2>
              {byPeriod.length === 0 ? (
                <p className="empty-state">Sin datos para el período</p>
              ) : (
                <div className="period-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Período</th>
                        <th>Ventas</th>
                        <th>Total (BOB)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byPeriod.map((item) => (
                        <tr key={item.period}>
                          <td>{item.period}</td>
                          <td>{item.count}</td>
                          <td>{item.total.toLocaleString('es-BO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="report-section">
              <h2>Por agente</h2>
              {byAgent.length === 0 ? (
                <p className="empty-state">Sin datos</p>
              ) : (
                <div className="period-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Agente ID</th>
                        <th>Ventas</th>
                        <th>Total (BOB)</th>
                        <th>Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byAgent.map((item) => (
                        <tr key={item.agentId}>
                          <td className="agent-id">{item.agentId.slice(0, 8)}…</td>
                          <td>{item.count}</td>
                          <td>{item.total.toLocaleString('es-BO')}</td>
                          <td>{item.average.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
