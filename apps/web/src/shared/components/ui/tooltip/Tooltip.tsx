import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Tooltip.css';

export interface TooltipProps {
  children?: ReactNode;
  className?: string;
}

export function Tooltip({ children, className = '' }: TooltipProps) {
  return <span className={cx('ui-tooltip', className)}>{children}</span>;
}
