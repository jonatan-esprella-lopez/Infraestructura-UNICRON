import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Drawer.css';

export interface DrawerProps {
  children?: ReactNode;
  className?: string;
}

export function Drawer({ children, className = '' }: DrawerProps) {
  return <aside className={cx('ui-drawer', className)}>{children}</aside>;
}
