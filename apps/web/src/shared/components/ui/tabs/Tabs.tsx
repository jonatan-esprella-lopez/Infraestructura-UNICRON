import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Tabs.css';

export interface TabsProps {
  children?: ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return <div className={cx('ui-tabs', className)}>{children}</div>;
}
