import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useRootStore } from '@store/root-store';
import { ROUTES } from '@core/constants/routes.constants';
import { Home, Brain, FileText, BarChart3, Users, Mail, Lock, User, Briefcase, Phone, Building } from 'lucide-react';
import { LocationSelector, type LocationValue } from '@modules/proptech/shared/components/location-selector';
import './AuthPage.css';

const DEMO_ACCOUNTS = [
<<<<<<< HEAD
  { role: 'Administrador', email: 'admin@intersim.bo', password: 'admin123', color: '#dc2626' },
  { role: 'Agente', email: 'agente@intersim.bo', password: 'agente123', color: '#2563eb' },
  { role: 'Propietario', email: 'propietario@intersim.bo', password: 'prop123', color: '#059669' },
  { role: 'Cliente', email: 'cliente@intersim.bo', password: 'cliente123', color: '#7c3aed' },
=======
  { role: 'Administrador', email: 'admin@wasi.bo', password: 'admin123', color: '#dc2626' },
  { role: 'Agente', email: 'agente@wasi.bo', password: 'agente123', color: '#2563eb' },
  { role: 'Propietario', email: 'propietario@wasi.bo', password: 'prop123', color: '#059669' },
  { role: 'Cliente', email: 'cliente@wasi.bo', password: 'cliente123', color: '#7c3aed' },
>>>>>>> origin/exp/pres
];

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useRootStore();
  
  const isRegister = location.pathname.includes('register');

  const [role, setRole] = useState<'agent' | 'owner' | 'client'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agency, setAgency] = useState('');
  const [locationValue, setLocationValue] = useState<LocationValue>({});
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        // Mock register for now or use actual service if available
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.setItem('intersim.registration-location', JSON.stringify(locationValue));
        const { token, user } = await authService.login(email.trim(), password); // Mock fallback
        localStorage.setItem('intersim.token', token);
        setCurrentUser(user);
      } else {
        const { token, user } = await authService.login(email.trim(), password);
        localStorage.setItem('intersim.token', token);
        setCurrentUser(user);
      }
      navigate(ROUTES.proptech, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al ${isRegister ? 'registrarse' : 'iniciar sesión'}`);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  const bgImage = isRegister ? '/register_hero.png' : '/login_hero.png';

  return (
    <div className="auth-page">
      <div className="auth-panel-left" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="auth-panel-left-overlay" />
        <div className="auth-brand-content">
          <div className="auth-brand-body">
            <h2>{isRegister ? 'Únete a la revolución inmobiliaria' : 'Bienvenido de nuevo a tu portal'}</h2>
            <p className="auth-brand-desc">
              Experimenta el poder de la inteligencia artificial aplicada al sector inmobiliario boliviano.
            </p>
            <ul className="auth-features">
              <li><Home size={20} className="auth-feat-icon" /> Gestión integral de propiedades</li>
              <li><Brain size={20} className="auth-feat-icon" /> Matching inteligente con IA</li>
              <li><FileText size={20} className="auth-feat-icon" /> Revisión automática de contratos</li>
              <li><BarChart3 size={20} className="auth-feat-icon" /> Reportes y análisis en tiempo real</li>
              <li><Users size={20} className="auth-feat-icon" /> Ecosistema para todos los actores</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
            <p>{isRegister ? 'Comienza tu experiencia premium' : 'Accede a tu plataforma segura'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={(e) => { void handleSubmit(e); }}>
            {isRegister && (
              <div className="auth-role-selector">
                <p className="auth-role-label">¿Qué tipo de cuenta deseas crear?</p>
                <div className="auth-role-grid">
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'client' ? 'selected' : ''}`}
                    onClick={() => setRole('client')}
                  >
                    <User className="auth-role-icon" size={24} />
                    <span>Cliente</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'owner' ? 'selected' : ''}`}
                    onClick={() => setRole('owner')}
                  >
                    <Home className="auth-role-icon" size={24} />
                    <span>Propietario</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-role-card ${role === 'agent' ? 'selected' : ''}`}
                    onClick={() => setRole('agent')}
                  >
                    <Briefcase className="auth-role-icon" size={24} />
                    <span>Agente</span>
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <label className="auth-label">
                Nombre Completo
                <div className="auth-input-wrapper">
                  <User size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input with-icon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required={isRegister}
                  />
                </div>
              </label>
            )}

            <label className="auth-label">
              Correo Electrónico
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            {isRegister && (
              <label className="auth-label">
                Teléfono / WhatsApp
                <div className="auth-input-wrapper">
                  <Phone size={18} className="auth-input-icon" />
                  <input
                    type="tel"
                    className="auth-input with-icon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +591 71234567"
                    required={isRegister}
                  />
                </div>
              </label>
            )}

            {isRegister && (
              <LocationSelector
                autoDetect
                className="auth-location"
                label="Ubicacion principal"
                value={locationValue}
                onChange={setLocationValue}
              />
            )}

            {isRegister && role === 'agent' && (
              <label className="auth-label">
                Empresa / Inmobiliaria (Opcional)
                <div className="auth-input-wrapper">
                  <Building size={18} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input with-icon"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    placeholder="Nombre de tu agencia"
                  />
                </div>
              </label>
            )}

            <label className="auth-label">
              Contraseña
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : isRegister ? 'Crear cuenta ahora' : 'Entrar al portal'}
            </button>
          </form>

          <div className="auth-switch-mode">
            {isRegister ? (
              <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
            ) : (
              <p>¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link></p>
            )}
          </div>

          {!isRegister && (
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
          )}
        </div>
      </div>
    </div>
  );
}
