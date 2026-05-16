import { useState, useEffect, useCallback } from 'react';
import { saleService } from '../../../services/sale.service';
import type { PropertySale, CreateSalePayload, SaleType, PaymentMethod, SaleLocation, SaleChannel } from '../../../types/sale.types';
import {
  SALE_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  SALE_LOCATION_LABELS,
  SALE_CHANNEL_LABELS,
} from '../../../types/sale.types';
import './admin-sales-page.css';

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

export function AdminSalesPage() {
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta venta?')) return;
    try {
      await saleService.remove(id);
      await load();
    } catch {
      setError('Error al eliminar venta');
    }
  };

  const totalAmount = sales.reduce((s, sale) => s + sale.amount, 0);

  return (
    <div className="admin-sales-page">
      <div className="sales-header">
        <div>
          <h1>Registro de Ventas</h1>
          <p className="sales-subtitle">{sales.length} transacciones · Total: {totalAmount.toLocaleString('es-BO')} BOB</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Registrar venta</button>
      </div>

      {error && <div className="sales-error">{error}</div>}

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
                  Lugar de venta
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
                  placeholder="Observaciones adicionales..."
                />
              </label>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Registrar venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="sales-loading">Cargando ventas...</div>
      ) : (
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Producto / Servicio</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Lugar</th>
                <th>Canal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr><td colSpan={8} className="empty-state">No hay ventas registradas</td></tr>
              )}
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{new Date(sale.soldAt).toLocaleDateString('es-BO')}</td>
                  <td><span className="sale-type-badge">{SALE_TYPE_LABELS[sale.saleType]}</span></td>
                  <td>{sale.productOrService}</td>
                  <td className="amount-cell">{sale.amount.toLocaleString('es-BO')} {sale.currency}</td>
                  <td>{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</td>
                  <td>{SALE_LOCATION_LABELS[sale.saleLocation]}</td>
                  <td>{SALE_CHANNEL_LABELS[sale.saleChannel]}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => { void handleDelete(sale.id); }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
