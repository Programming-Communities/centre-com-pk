'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation, setGlobalLang } from '@/hooks/useTranslation';

interface LanguageSwitcherProps {
  lang: string;
}

const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ur', name: 'اردو', dir: 'rtl' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', dir: 'ltr' },
];

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();
  const { t } = useTranslation({ namespace: 'common' });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isRTL = lang === 'ur' || lang === 'ar';

  // ✅ HYDration FIX — Default colors (LIGHT)
  const defaultThemeColors = {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
  };

  // ✅ HYDration FIX — Sirf mounted hone ke baad theme use karo
  const colors = mounted ? (themeColors || defaultThemeColors) : defaultThemeColors;

  // ✅ HYDration FIX — mounted set karo
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const switchLanguage = (newLang: string) => {
    setGlobalLang(newLang);
    
    const segments = pathname.split('/').filter(Boolean);
    const langCodes = languages.map(l => l.code);
    
    if (segments.length > 0 && langCodes.includes(segments[0])) {
      segments.shift();
    }
    
    const newPath = '/' + newLang + (segments.length > 0 ? '/' + segments.join('/') : '');
    
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="control-button flex items-center gap-1 px-2"
        style={{
          backgroundColor: isOpen ? `${colors.primary}15` : colors.surface,
          color: colors.text.primary,
          borderColor: isOpen ? colors.primary : colors.border,
        }}
        title={t('action.language', 'Select Language')}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="control-icon" />
        <span className="text-xs font-medium hidden sm:inline">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute mt-2 py-2 w-40 rounded-lg shadow-lg z-50 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
          }}
          role="menu"
          aria-label="Language selection menu"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLanguage(l.code)}
              className={`w-full px-4 py-2 text-sm transition-colors ${
                isRTL ? 'text-right' : 'text-left'
              } hover:bg-surface`}
              style={{
                color: l.code === lang ? colors.primary : colors.text.primary,
                backgroundColor: l.code === lang ? `${colors.primary}10` : 'transparent',
              }}
              role="menuitem"
              aria-label={`Switch to ${l.name}`}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}