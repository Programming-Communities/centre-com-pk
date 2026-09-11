'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ToolClientWrapperProps {
  children: ReactNode;
}

export default function ToolClientWrapper({ children }: ToolClientWrapperProps) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ FIX: Static fallback colors for server + first client render
  const staticColors = {
    background: '#ffffff',
    textPrimary: '#0f172a',
  };

  const backgroundColor = mounted
    ? (themeColors?.background || staticColors.background)
    : staticColors.background;

  const textColor = mounted
    ? (themeColors?.text?.primary || staticColors.textPrimary)
    : staticColors.textPrimary;

  return (
    <div
      className="tool-client-wrapper"
      suppressHydrationWarning
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {children}
    </div>
  );
}
