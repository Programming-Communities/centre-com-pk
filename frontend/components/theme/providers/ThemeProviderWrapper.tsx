// components/theme/providers/ThemeProviderWrapper.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DEFAULT_THEME } from '../utils/theme-utils';

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME;
    root.classList.add(`theme-${savedTheme}`);
    setMounted(true);
  }, []);

  // ✅ ALWAYS render ThemeProvider, just suppress hydration warning
  return (
    <ThemeProvider>
      <div suppressHydrationWarning style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}