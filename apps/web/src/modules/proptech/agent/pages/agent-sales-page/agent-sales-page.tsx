import { useState, useEffect, useCallback } from 'react';
import { saleService } from '../../../services/sale.service';
import type { PropertySale, CreateSalePayload, SaleType, PaymentMethod, SaleLocation, SaleChannel } from '../../../types/sale.types';
import {
  SALE_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  SALE_LOCATION_LABELS,
  SALE_CHANNEL_LABELS,
} from '../../../types/sale.types';
import './agent-sales-page.css';

const EMPTY_FORM: CreateSalePayload = {
  saleType: 'property_sale',
  productOrService: '',
  amount: 0,
  currency: 'BOB',
  paymentMethod: 'cash',
  saleLocation: 'office',
  saleChannel: 'in_person',
  notes: '',
};

export function AgentSalesPage() {
  const [sales, setSales] = useState<PropertySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateSalePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await saleService.findAll();
      setSales(data);
    } catch {
      setError('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saleService.create(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch {
      setError('Error al registrar venta');
    } finally {
      setSaving(false);
    }
  };

  const totalMonth = sales
    .filter((s) => {
      const d = new Date(s.soldAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="agent-sales-page">
      <div className="agent-sales-header">
        <div>
          <h1>Mis Ventas</h1>
          <p className="agent-sales-subtitle">Este mes: {totalMonth.toLocaleString('es-BO')} BOB</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Registrar venta</button>
      </div>

      {error && <div className="agent-sales-error">{error}</div>}

      {showForm && (
        <div className="sales-modal-overlay">
          <div className="sales-modal">
            <div className="modal-header">
              <h2>Nueva Venta</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="sales-form" onSubmit={(e) => { void handleSubmit(e); }}>
              <div className="form-row">
                <label>
                  Tipo de venta
                  <select value={form.saleType} onChange={(e) => setForm({ ...form, saleType: e.target.value as SaleType })} required>
                    {Object.entries(SALE_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Producto / Servicio
                  <input
                    value={form.productOrService}
                    onChange={(e) => setForm({ ...form, productOrService: e.target.value })}
                    placeholder="Ej: Dpto. 3B Torre Centro"
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Monto
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    required
                  />
                </label>
                <label>
                  Moneda
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option value="BOB">BOB</option>
                    <option value="USD">USD</option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Método de pago
                  <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })} required>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Lugar
                  <select value={form.saleLocation} onChange={(e) => setForm({ ...form, saleLocation: e.target.value as SaleLocation })} required>
                    {Object.entries(SALE_LOCATION_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label>
                  Canal
                  <select value={form.saleChannel} onChange={(e) => setForm({ ...form, saleChannel: e.target.value as SaleChannel })} required>
                    {Object.entries(SALE_CHANNEL_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Fecha de venta
                  <input
                    type="date"
                    onChange={(e) => setForm({ ...form, soldAt: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Notas
                <textarea
                  value={form.notes ?? ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Observaciones..."
                />
              </label>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="agent-sales-loading">Cargando...</div>
      ) : (
        <div className="agent-sales-list">
          {sales.length === 0 && <p className="agent-sales-empty">No tienes ventas registradas aún.</p>}
          {sales.map((sale) => (
            <div key={sale.id} className="sale-card">
              <div className="sale-card-header">
                <span className="sale-type-tag">{SALE_TYPE_LABELS[sale.saleType]}</span>
                <span className="sale-date">{new Date(sale.soldAt).toLocaleDateString('es-BO')}</span>
              </div>
              <p className="sale-product">{sale.productOrService}</p>
              <div className="sale-card-footer">
                <span className="sale-amount">{sale.amount.toLocaleString('es-BO')} {sale.currency}</span>
                <span className="sale-meta">{PAYMENT_METHOD_LABELS[sale.paymentMethod]} · {SALE_LOCATION_LABELS[sale.saleLocation]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
