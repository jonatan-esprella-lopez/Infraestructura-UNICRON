import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function LandingLayout() {
  return (
    <div className="landing-layout">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
