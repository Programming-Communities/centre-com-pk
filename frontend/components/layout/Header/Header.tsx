'use client';

import Link from 'next/link';
import { 
  Moon, Sun, Home, Type, Palette, Menu, User, BookOpen
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import MobileDashboard from '../MobileDashboard/MobileDashboard';
import Image from 'next/image';
import MegaMenu from '../MegaMenu/MegaMenu';
import './Header.css';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
  lang: string;
}

const headerTranslations: Record<string, Record<string, string>> = {
  ur: { 'menu.home': 'ہوم', 'menu.blog': 'بلاگ', 'action.signin': 'سائن ان', 'action.signup': 'اکاؤنٹ بنائیں', 'action.theme': 'تھیم', 'action.light': 'لائٹ موڈ', 'action.dark': 'ڈارک موڈ', 'aria.menu': 'مینو کھولیں', 'aria.user': 'صارف مینو' },
  ar: { 'menu.home': 'الرئيسية', 'menu.blog': 'المدونة', 'action.signin': 'تسجيل الدخول', 'action.signup': 'إنشاء حساب', 'action.theme': 'المظهر', 'action.light': 'الوضع الفاتح', 'action.dark': 'الوضع الداكن', 'aria.menu': 'فتح القائمة', 'aria.user': 'قائمة المستخدم' },
  hi: { 'menu.home': 'होम', 'menu.blog': 'ब्लॉग', 'action.signin': 'साइन इन', 'action.signup': 'खाता बनाएं', 'action.theme': 'थीम', 'action.light': 'लाइट मोड', 'action.dark': 'डार्क मोड', 'aria.menu': 'मेनू खोलें', 'aria.user': 'उपयोगकर्ता मेनू' },
  en: { 'menu.home': 'Home', 'menu.blog': 'Blog', 'action.signin': 'Sign In', 'action.signup': 'Create Account', 'action.theme': 'Theme', 'action.light': 'Light Mode', 'action.dark': 'Dark Mode', 'aria.menu': 'Open menu', 'aria.user': 'User menu' }
};

export default function Header({ lang }: HeaderProps) {
  const { t } = useTranslation({ namespace: 'menu' });
  
  const getText = useCallback((key: string, fallback: string): string => {
    const translated = t(key);
    if (translated && typeof translated === 'string' && translated !== key) return translated;
    if (headerTranslations[lang]?.[key]) return headerTranslations[lang][key];
    if (headerTranslations.en[key]) return headerTranslations.en[key];
    return fallback;
  }, [lang, t]);
  
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const fontButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    themeColors, isDarkMode, toggleDarkMode, fontFamily, setFontFamily, 
    availableFonts, theme, setTheme, availableThemes 
  } = useTheme();

  // ✅ HYDration FIX — Default values LIGHT theme (server + client same)
  const defaultThemeColors = {
    background: '#ffffff',
    surface: '#f8fafc',
    text: { primary: '#0f172a', secondary: '#334155', accent: '#ffffff' },
    border: '#e2e8f0',
    primary: '#1d4ed8',
    secondary: '#1e40af',
  };
  
  // ✅ HYDration FIX — Sirf mounted hone ke baad theme use karo
  const colors = mounted ? (themeColors || defaultThemeColors) : defaultThemeColors;

  // ✅ HYDration FIX — mounted set karo
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) setIsHeaderVisible(false);
      else if (currentScrollY < lastScrollY) setIsHeaderVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleDashboard = useCallback(() => setIsDashboardOpen(!isDashboardOpen), [isDashboardOpen]);
  const toggleFontMenu = useCallback(() => { setIsFontMenuOpen(!isFontMenuOpen); setIsThemeMenuOpen(false); setIsUserMenuOpen(false); }, [isFontMenuOpen]);
  const toggleThemeMenu = useCallback(() => { setIsThemeMenuOpen(!isThemeMenuOpen); setIsFontMenuOpen(false); setIsUserMenuOpen(false); }, [isThemeMenuOpen]);
  const toggleUserMenu = useCallback(() => { setIsUserMenuOpen(!isUserMenuOpen); setIsFontMenuOpen(false); setIsThemeMenuOpen(false); }, [isUserMenuOpen]);

  const handleFontChange = (fontValue: string) => { setFontFamily(fontValue); setIsFontMenuOpen(false); };
  const handleThemeChange = (themeValue: string) => { setTheme(themeValue as any); setIsThemeMenuOpen(false); };

  return (
    <div suppressHydrationWarning>
      <header 
        className="header-container"
        suppressHydrationWarning
        style={{
          transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isHeaderVisible ? 1 : 0,
          backgroundColor: `${colors.background}ee`,
          borderBottom: `1px solid ${colors.border}30`,
        }}
      >
        <div className="responsive-container">
          <div className="header-inner">
            
            {/* LOGO */}
            <div className="logo-container">
              <Link href={`/${lang}`} className="logo-link">
                <Image src="/centre.com.pk.jpeg" alt="Centre.com.pk" width={120} height={35} className="logo-image" priority style={{ objectFit: 'contain' }} />
              </Link>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="desktop-nav">
              <div className="desktop-nav-inner">
                <Link href={`/${lang}`} className="home-button" suppressHydrationWarning style={{ color: colors.text.primary, borderColor: colors.border, backgroundColor: colors.surface }}>
                  <Home className="home-icon" /><span>{getText('menu.home', 'Home')}</span>
                </Link>
                <div className="mega-menu-item"><MegaMenu category="all" lang={lang} /></div>
                <Link href={`/${lang}/blog`} className="home-button" suppressHydrationWarning style={{ color: colors.text.primary, borderColor: colors.border, backgroundColor: colors.surface }}>
                  <BookOpen className="home-icon" /><span>{getText('menu.blog', 'Blog')}</span>
                </Link>
              </div>
            </nav>

            {/* RIGHT CONTROLS */}
            <div className="header-controls">
              <LanguageSwitcher lang={lang} />

              {/* USER MENU */}
              <div className="relative" ref={userMenuRef}>
                <button onClick={toggleUserMenu} className="control-button" suppressHydrationWarning style={{ backgroundColor: isUserMenuOpen ? `${colors.primary}15` : colors.surface, color: colors.text.primary, borderColor: isUserMenuOpen ? colors.primary : colors.border }}>
                  <User className="control-icon" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 py-2" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                    <Link href={`/${lang}/auth/signin`} className="flex items-center gap-2 px-4 py-2.5 text-sm" style={{ color: colors.text.primary }}>🔑 {getText('action.signin', 'Sign In')}</Link>
                    <Link href={`/${lang}/auth/signup`} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold" style={{ color: colors.primary }}>✨ {getText('action.signup', 'Create Account')}</Link>
                  </div>
                )}
              </div>

              {/* FONT SELECTOR */}
              <div className="font-control-wrapper">
                <button ref={fontButtonRef} onClick={toggleFontMenu} className="font-btn control-button" suppressHydrationWarning style={{ backgroundColor: isFontMenuOpen ? `${colors.primary}15` : colors.surface, color: colors.text.primary, borderColor: isFontMenuOpen ? colors.primary : colors.border }}>
                  <Type className="control-icon" />
                </button>
                {isFontMenuOpen && (
                  <div ref={fontMenuRef} className="font-dropdown" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                    <div className="dropdown-content">
                      {availableFonts.map((font) => (
                        <button key={font.value} onClick={() => handleFontChange(font.value)} className="font-option" style={{ backgroundColor: fontFamily === font.value ? `${colors.primary}15` : 'transparent', color: fontFamily === font.value ? colors.primary : colors.text.primary, fontFamily: font.value }}>{font.label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DARK MODE TOGGLE — HYDration FIXED */}
              <button onClick={toggleDarkMode} className="control-button" suppressHydrationWarning style={{ backgroundColor: colors.surface, color: colors.text.primary, borderColor: colors.border }} title={mounted && isDarkMode ? getText('action.light', 'Light Mode') : getText('action.dark', 'Dark Mode')}>
                {!mounted ? <Moon className="control-icon" /> : isDarkMode ? <Sun className="control-icon" /> : <Moon className="control-icon" />}
              </button>

              {/* THEME SELECTOR */}
              <div className="theme-control-wrapper">
                <button ref={themeButtonRef} onClick={toggleThemeMenu} className="theme-btn control-button" suppressHydrationWarning style={{ backgroundColor: isThemeMenuOpen ? `${colors.primary}15` : colors.surface, color: colors.text.primary, borderColor: isThemeMenuOpen ? colors.primary : colors.border }}>
                  <Palette className="control-icon" />
                </button>
                {isThemeMenuOpen && (
                  <div ref={themeMenuRef} className="theme-dropdown" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                    <div className="dropdown-content">
                      <div className="dropdown-header" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>{getText('action.theme', 'Theme')}</div>
                      {availableThemes.map((themeItem) => (
                        <button key={themeItem.value} onClick={() => handleThemeChange(themeItem.value)} className="theme-option" style={{ backgroundColor: theme === themeItem.value ? `${colors.primary}15` : 'transparent', color: theme === themeItem.value ? colors.primary : colors.text.primary }}>
                          <div className="theme-option-inner">
                            <div className="theme-indicator" style={{ borderColor: colors.border, background: theme === themeItem.value ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.surface }} />
                            <span>{themeItem.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE MENU */}
              <button onClick={toggleDashboard} className="mobile-menu-button control-button" suppressHydrationWarning style={{ color: colors.text.primary, backgroundColor: `${colors.primary}10`, borderColor: colors.border }}>
                <Menu className="control-icon" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} lang={lang} />
    </div>
  );
}