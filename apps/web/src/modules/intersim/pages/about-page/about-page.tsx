import { Users, Award, Shield, Target } from 'lucide-react';
import './about-page.css';

export function AboutPage() {
  return (
    <div className="sub-page">
      <section className="sub-hero" style={{ backgroundImage: 'url(/about_hero.png)' }}>
        <div className="sub-hero-overlay" />
        <div className="sub-hero-content">
          <h1>Nuestra Historia y Visión</h1>
          <p>Transformando el mercado inmobiliario boliviano desde hace 12 años con tecnología e integridad.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-text-content">
            <span className="about-eyebrow">Sobre INTERSIM</span>
            <h2>La PropTech que redefinió los bienes raíces</h2>
            <p>
              Fundada con la visión de transparentar y agilizar un mercado complejo, INTERSIM nació como una respuesta a la necesidad de seguridad y eficiencia en las transacciones inmobiliarias en Bolivia.
            </p>
            <p>
              Hoy, somos la red inmobiliaria y tecnológica más grande del país, combinando la experiencia humana de nuestros agentes certificados con inteligencia artificial de vanguardia para garantizar operaciones rápidas, seguras y rentables.
            </p>
          </div>
          <div className="about-image-grid">
            <div className="about-img main-img" style={{ backgroundImage: 'url(/about_office.png)' }} />
          </div>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="about-stats-container">
          <div className="about-stat">
            <div className="stat-number">12</div>
            <div className="stat-label">Años de experiencia en el mercado</div>
          </div>
          <div className="about-stat">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Familias con un nuevo hogar</div>
          </div>
          <div className="about-stat">
            <div className="stat-number">300+</div>
            <div className="stat-label">Agentes asociados certificados</div>
          </div>
          <div className="about-stat">
            <div className="stat-number">$150M</div>
            <div className="stat-label">En volumen de transacciones seguras</div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-values-header">
          <h2>Nuestros Pilares</h2>
          <p>Los valores fundamentales que guían cada decisión y cada línea de código en nuestra plataforma.</p>
        </div>
        <div className="about-values-grid">
          <div className="value-card">
            <div className="value-icon"><Shield size={32} /></div>
            <h3>Integridad Absoluta</h3>
            <p>Transparencia total en precios, contratos y condiciones. No hay letras pequeñas en nuestra plataforma.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Target size={32} /></div>
            <h3>Innovación Constante</h3>
            <p>Desarrollamos tecnología propia con IA para resolver los problemas reales de compradores y agentes.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Award size={32} /></div>
            <h3>Excelencia Operativa</h3>
            <p>Procesos estandarizados y auditados para asegurar que el nivel de servicio sea impecable en cada ciudad.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Users size={32} /></div>
            <h3>Enfoque Humano</h3>
            <p>La tecnología es nuestra herramienta, pero las personas (agentes y familias) son el centro de todo lo que hacemos.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
