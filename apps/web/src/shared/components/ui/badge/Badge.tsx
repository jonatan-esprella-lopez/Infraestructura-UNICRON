import type { ReactNode } from 'react';
import './Badge.css';

export function Badge({ children }: { children: ReactNode }) {
  return <span className="ui-badge">{children}</span>;
}
