import { useEffect, useState } from 'react';
import { UI } from '@core/constants/ui.constants';

export function useResponsive() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    isMobile: width < UI.mobileBreakpoint,
    isDesktop: width >= UI.mobileBreakpoint,
  };
}
