import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { useRootStore } from '@store/root-store';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useRootStore();
  const isLoggedIn = Boolean(currentUser.id);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('intersim.token');
    navigate('/');
  };

  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        <Link to="/" className="lp-nav-brand">
          <div className="lp-nav-logo">IS</div>
          <div className="lp-nav-brand-text">
            <span className="lp-nav-name">INTERSIM</span>
            <span className="lp-nav-sub">PropTech</span>
          </div>
        </Link>

        <div className={`lp-nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#propiedades" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Propiedades</a>
          <a href="#servicios" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#nosotros" className="lp-nav-link" onClick={() => setMenuOpen(false)}>Nosotros</a>
        </div>

        <div className="lp-nav-actions">
          {isLoggedIn ? (
            <>
              <button className="lp-nav-btn-ghost" onClick={() => navigate(ROUTES.proptech)}>
                Mi portal
              </button>
              <button className="lp-nav-btn-outline" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button className="lp-nav-btn-ghost" onClick={() => navigate(ROUTES.login)}>
                Iniciar sesión
              </button>
              <button className="lp-nav-btn-primary" onClick={() => navigate(ROUTES.login)}>
                Registrarse
              </button>
            </>
          )}
        </div>

        <button className="lp-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
