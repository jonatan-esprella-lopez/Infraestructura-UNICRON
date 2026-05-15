import type { ReactNode } from 'react';

export interface DrawerProps {
  children?: ReactNode;
  className?: string;
}

export function Drawer({ children, className = '' }: DrawerProps) {
  return <aside className={className}>{children}</aside>;
}
