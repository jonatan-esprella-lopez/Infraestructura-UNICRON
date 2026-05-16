import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function LandingLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="landing-layout">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
