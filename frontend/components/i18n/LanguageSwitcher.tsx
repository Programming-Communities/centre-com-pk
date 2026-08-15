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
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();
  const { t } = useTranslation({ namespace: 'common' });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isRTL = lang === 'ur' || lang === 'ar';

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
    
    // ✅ PROPER FIX: Remove current lang from path, then add new lang
    const segments = pathname.split('/').filter(Boolean);
    const langCodes = languages.map(l => l.code);
    
    // Remove first segment if it's a language code
    if (segments.length > 0 && langCodes.includes(segments[0])) {
      segments.shift();
    }
    
    // Build new path with new language
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
        className="control-button flex items-center gap-1 px-2"
        style={{
          backgroundColor: isOpen ? `${themeColors.primary}15` : themeColors.surface,
          color: themeColors.text.primary,
          borderColor: isOpen ? themeColors.primary : themeColors.border,
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
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
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
                color: l.code === lang ? themeColors.primary : themeColors.text.primary,
                backgroundColor: l.code === lang ? `${themeColors.primary}10` : 'transparent',
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
