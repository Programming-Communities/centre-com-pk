'use client';

import { ReactNode } from 'react';
import styles from './ResponsiveContainer.module.css';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveContainer({ 
  children, 
  className = '' 
}: ResponsiveContainerProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  );
}