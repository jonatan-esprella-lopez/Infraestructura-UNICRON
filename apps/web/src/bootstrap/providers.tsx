import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RootStoreProvider } from '@store/root-store';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <RootStoreProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </RootStoreProvider>
  );
}
