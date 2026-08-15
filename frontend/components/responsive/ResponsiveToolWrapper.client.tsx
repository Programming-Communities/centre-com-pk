'use client';

import { ReactNode } from 'react';
import styles from './ResponsiveToolWrapper.module.css';

interface ResponsiveToolWrapperProps {
  children: ReactNode;
  toolName?: string;
}

export default function ResponsiveToolWrapper({ 
  children, 
  toolName 
}: ResponsiveToolWrapperProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}