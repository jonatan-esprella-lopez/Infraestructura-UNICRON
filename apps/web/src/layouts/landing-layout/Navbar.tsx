import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants/routes.constants';
import { useRootStore } from '@store/root-store';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useRootStore();
  const isLoggedIn = Boolean(currentUser.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('intersim.token');
    navigate('/');
  };

  return (
    <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <Link to="/" className="lp-nav-brand">
          <div className="lp-nav-logo">IS</div>
          <div className="lp-nav-brand-text">
            <span className="lp-nav-name">INTERSIM</span>
            <span className="lp-nav-sub">PropTech</span>
          </div>
        </Link>

        <div className={`lp-nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to={ROUTES.propiedades} className="lp-nav-link" onClick={() => setMenuOpen(false)}>Propiedades</Link>
          <Link to={ROUTES.servicios} className="lp-nav-link" onClick={() => setMenuOpen(false)}>Servicios</Link>
          <Link to={ROUTES.nosotros} className="lp-nav-link" onClick={() => setMenuOpen(false)}>Nosotros</Link>
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
