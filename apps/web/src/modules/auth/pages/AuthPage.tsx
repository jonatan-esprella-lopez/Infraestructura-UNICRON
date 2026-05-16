import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useRootStore } from '@store/root-store';
import { ROUTES } from '@core/constants/routes.constants';
import './AuthPage.css';

const DEMO_ACCOUNTS = [
  { role: 'Administrador', email: 'admin@intersim.bo', password: 'admin123', color: '#dc2626' },
  { role: 'Agente', email: 'agente@intersim.bo', password: 'agente123', color: '#2563eb' },
  { role: 'Propietario', email: 'propietario@intersim.bo', password: 'prop123', color: '#059669' },
  { role: 'Cliente', email: 'cliente@intersim.bo', password: 'cliente123', color: '#7c3aed' },
];

export function AuthPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useRootStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authService.login(email.trim(), password);
      localStorage.setItem('intersim.token', token);
      setCurrentUser(user);
      navigate(ROUTES.proptech, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">IS</div>
          <div>
            <div className="auth-brand-name">INTERSIM</div>
            <div className="auth-brand-tagline">PropTech Bolivia</div>
          </div>
        </div>
        <div className="auth-brand-body">
          <h2>La plataforma inmobiliaria más completa de Bolivia</h2>
          <ul className="auth-features">
            <li><span className="auth-feat-icon">🏠</span>Gestión completa de propiedades</li>
            <li><span className="auth-feat-icon">🤖</span>Matching inteligente con IA</li>
            <li><span className="auth-feat-icon">📄</span>Revisión de contratos con IA</li>
            <li><span className="auth-feat-icon">📊</span>Reportes y analytics en tiempo real</li>
            <li><span className="auth-feat-icon">👥</span>Portal diferenciado por rol</li>
          </ul>
        </div>
        <p className="auth-brand-footer">Santa Cruz · Cochabamba · La Paz</p>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Iniciar sesión</h1>
            <p>Accede a tu portal INTERSIM</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={(e) => { void handleSubmit(e); }}>
            <label className="auth-label">
              Correo electrónico
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-label">
              Contraseña
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Entrar al portal'}
            </button>
          </form>

          <div className="auth-demo">
            <div className="auth-demo-divider">
              <span>Acceso rápido de demostración</span>
            </div>
            <div className="auth-demo-grid">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  className="auth-demo-btn"
                  style={{ '--demo-color': acc.color } as React.CSSProperties}
                  onClick={() => fillDemo(acc)}
                  type="button"
                >
                  <span className="auth-demo-role">{acc.role}</span>
                  <span className="auth-demo-email">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <a href="/" className="auth-back-link">← Volver al inicio</a>
      </div>
    </div>
  );
}
