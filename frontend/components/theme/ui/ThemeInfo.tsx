'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function ThemeInfo() {
  const { theme, isDarkMode, fontFamily } = useTheme();

  return (
    <div className="fixed top-4 left-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm shadow-lg">
      <div className="flex items-center gap-2">
        <span className="font-medium">Theme:</span>
        <span className="capitalize">{theme.replace('-', ' ')}</span>
        <span className="mx-1">|</span>
        <span className="font-medium">Mode:</span>
        <span>{isDarkMode ? 'Dark' : 'Light'}</span>
        <span className="mx-1">|</span>
        <span className="font-medium">Font:</span>
        <span style={{ fontFamily }}>{fontFamily}</span>
      </div>
    </div>
  );
}