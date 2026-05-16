import { Outlet } from 'react-router-dom';
import { Navbar } from '../landing-layout/Navbar';
import '../landing-layout/LandingLayout.css'; // Just in case Navbar styles rely on something there, though Navbar has its own css

export function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        <Outlet />
      </div>
    </div>
  );
}
