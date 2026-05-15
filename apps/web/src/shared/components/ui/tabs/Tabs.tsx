import type { ReactNode } from 'react';

export interface TabsProps {
  children?: ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return <div className={className}>{children}</div>;
}
