import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { Bot, FileSignature, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import './services-page.css';

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="sub-page">
      <section className="sub-hero" style={{ backgroundImage: 'url(/services_hero.png)' }}>
        <div className="sub-hero-overlay" />
        <div className="sub-hero-content">
          <h1>Servicios Premium para Bienes Raíces</h1>
          <p>Innovación tecnológica para potenciar cada etapa de tus transacciones inmobiliarias.</p>
        </div>
      </section>

      <section className="services-detail-section">
        <div className="services-detail-container">
          
          <div className="srv-row">
            <div className="srv-image" style={{ backgroundImage: 'url(/service_compra.png)' }} />
            <div className="srv-content">
              <div className="srv-icon icon-blue"><Bot size={32} /></div>
              <h2>Compra inteligente</h2>
              <p>Nuestro algoritmo avanzado de <strong>Matching con IA</strong> analiza más de 50 variables para encontrar la propiedad que se ajuste perfectamente a tu estilo de vida, presupuesto y necesidades futuras.</p>
              <ul>
                <li>Recomendaciones hiper-personalizadas.</li>
                <li>Análisis de plusvalía y zonas de crecimiento.</li>
                <li>Acompañamiento en todo el proceso legal.</li>
              </ul>
              <button className="srv-btn" onClick={() => navigate(ROUTES.login)}>Empezar a buscar <ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="srv-row reverse">
            <div className="srv-image" style={{ backgroundImage: 'url(/service_legal.png)' }} />
            <div className="srv-content">
              <div className="srv-icon icon-purple"><FileSignature size={32} /></div>
              <h2>Asesoría Legal y Contratos IA</h2>
              <p>Protege tu patrimonio. Nuestro sistema de <strong>Contratos Inteligentes</strong> escanea documentos legales en segundos detectando cláusulas abusivas, omisiones o riesgos potenciales.</p>
              <ul>
                <li>Revisión instantánea de documentos.</li>
                <li>Generación automática de contratos estándar.</li>
                <li>Validación notarial integrada.</li>
              </ul>
              <button className="srv-btn" onClick={() => navigate(ROUTES.login)}>Proteger mi inversión <ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="srv-row">
            <div className="srv-image" style={{ backgroundImage: 'url(/service_alquiler.png)' }} />
            <div className="srv-content">
              <div className="srv-icon icon-green"><ShieldCheck size={32} /></div>
              <h2>Alquiler y Anticrético Seguro</h2>
              <p>Una plataforma que garantiza la tranquilidad de ambas partes. Verificamos antecedentes, capacidad de pago y estado legal de las propiedades para <strong>operaciones sin riesgo</strong>.</p>
              <ul>
                <li>Garantía de pagos puntuales.</li>
                <li>Contratos de anticrético respaldados.</li>
                <li>Gestión de mantenimiento desde la app.</li>
              </ul>
              <button className="srv-btn" onClick={() => navigate(ROUTES.login)}>Explorar opciones <ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="srv-row reverse">
            <div className="srv-image" style={{ backgroundImage: 'url(/hero-bg.png)' }} />
            <div className="srv-content">
              <div className="srv-icon icon-amber"><BarChart3 size={32} /></div>
              <h2>Herramientas para Agentes</h2>
              <p>Potencia tu carrera inmobiliaria con nuestro <strong>Dashboard de alto rendimiento</strong>. Gestiona tus leads, agenda visitas y cierra ventas más rápido con datos en tiempo real.</p>
              <ul>
                <li>CRM inmobiliario integrado.</li>
                <li>Reportes financieros y de rendimiento.</li>
                <li>Publicación multicanal de propiedades.</li>
              </ul>
              <button className="srv-btn" onClick={() => navigate(ROUTES.login)}>Únete como agente <ArrowRight size={16} /></button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
