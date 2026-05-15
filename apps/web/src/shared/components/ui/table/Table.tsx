import type { ReactNode } from 'react';
import './Table.css';

export function Table({ children }: { children: ReactNode }) {
  return <table className="data-table">{children}</table>;
}
