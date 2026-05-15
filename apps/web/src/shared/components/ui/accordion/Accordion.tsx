import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Accordion.css';

export interface AccordionProps {
  children?: ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={cx('ui-accordion', className)}>{children}</div>;
}
