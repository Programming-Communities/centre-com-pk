'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-40 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        backgroundColor: 'var(--surface)',
        color: isDarkMode ? 'var(--warning)' : 'var(--primary)',
        border: '2px solid var(--border)'
      }}
    >
      <div className="relative">
        {/* Sun Icon */}
        <Sun className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} ${isAnimating ? 'animate-spin' : ''}`} />
        
        {/* Moon Icon */}
        <Moon className={`absolute top-0 left-0 h-5 w-5 transition-all duration-300 ${isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} ${isAnimating ? 'animate-pulse' : ''}`} />
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
           style={{
             backgroundColor: 'var(--surface)',
             color: 'var(--text-primary)',
             border: '1px solid var(--border)'
           }}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </button>
  );
};

export default DarkModeToggle;