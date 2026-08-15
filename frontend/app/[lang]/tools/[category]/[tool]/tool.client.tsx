'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ToolClientWrapperProps {
  children: ReactNode;
}

export default function ToolClientWrapper({ children }: ToolClientWrapperProps) {
  const { themeColors } = useTheme();
  
  return (
    <div 
      className="tool-client-wrapper"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text.primary,
      }}
    >
      {children}
    </div>
  );
}