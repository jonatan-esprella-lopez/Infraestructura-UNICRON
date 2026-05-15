import type { ReactNode } from 'react';

export interface AccordionProps {
  children?: ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={className}>{children}</div>;
}
