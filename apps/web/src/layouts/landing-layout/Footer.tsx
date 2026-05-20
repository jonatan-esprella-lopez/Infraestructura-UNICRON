import { Link } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import './Footer.css';

export function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-footer-logo">IS</div>
          <div>
            <div className="lp-footer-name">WASI PropTech</div>
            <div className="lp-footer-desc">
              La plataforma inmobiliaria más completa de Bolivia.
              Conectamos compradores, vendedores y agentes con tecnología de punta.
            </div>
          </div>
        </div>

        <div className="lp-footer-cols">
          <div className="lp-footer-col">
            <h4>Servicios</h4>
            <ul>
              <li><Link to={ROUTES.login}>Compra de propiedades</Link></li>
              <li><Link to={ROUTES.login}>Alquiler</Link></li>
              <li><Link to={ROUTES.login}>Anticrético</Link></li>
              <li><Link to={ROUTES.login}>Asesoría legal</Link></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Plataforma</h4>
            <ul>
              <li><Link to={ROUTES.login}>Portal del agente</Link></li>
              <li><Link to={ROUTES.login}>Portal del propietario</Link></li>
              <li><Link to={ROUTES.login}>Portal del comprador</Link></li>
              <li><Link to={ROUTES.login}>Administración</Link></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Cobertura</h4>
            <ul>
              <li>Santa Cruz de la Sierra</li>
              <li>Cochabamba</li>
              <li>La Paz</li>
              <li>Sucre</li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>📞 +591 3 333 4444</li>
<<<<<<< HEAD
              <li>📧 info@intersim.bo</li>
=======
              <li>📧 info@wasi.bo</li>
>>>>>>> origin/exp/pres
              <li>📍 Santa Cruz, Bolivia</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <div className="lp-footer-bottom-inner">
          <span>© 2026 WASI PropTech. Todos los derechos reservados.</span>
          <div className="lp-footer-legal">
            <a href="#">Términos de uso</a>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
