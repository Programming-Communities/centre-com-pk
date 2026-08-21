'use client';

import Link from 'next/link';
import { 
  Moon,
  Sun,
  Home,
  Type,
  Palette,
  Menu,
  X,
  User,
  BookOpen
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
  ur: {
    'menu.home': 'ہوم',
    'menu.blog': 'بلاگ',
    'action.signin': 'سائن ان',
    'action.signup': 'اکاؤنٹ بنائیں',
    'action.theme': 'تھیم',
    'action.light': 'لائٹ موڈ',
    'action.dark': 'ڈارک موڈ',
    'aria.menu': 'مینو کھولیں',
    'aria.user': 'صارف مینو',
  },
  ar: {
    'menu.home': 'الرئيسية',
    'menu.blog': 'المدونة',
    'action.signin': 'تسجيل الدخول',
    'action.signup': 'إنشاء حساب',
    'action.theme': 'المظهر',
    'action.light': 'الوضع الفاتح',
    'action.dark': 'الوضع الداكن',
    'aria.menu': 'فتح القائمة',
    'aria.user': 'قائمة المستخدم',
  },
  hi: {
    'menu.home': 'होम',
    'menu.blog': 'ब्लॉग',
    'action.signin': 'साइन इन',
    'action.signup': 'खाता बनाएं',
    'action.theme': 'थीम',
    'action.light': 'लाइट मोड',
    'action.dark': 'डार्क मोड',
    'aria.menu': 'मेनू खोलें',
    'aria.user': 'उपयोगकर्ता मेनू',
  },
  en: {
    'menu.home': 'Home',
    'menu.blog': 'Blog',
    'action.signin': 'Sign In',
    'action.signup': 'Create Account',
    'action.theme': 'Theme',
    'action.light': 'Light Mode',
    'action.dark': 'Dark Mode',
    'aria.menu': 'Open menu',
    'aria.user': 'User menu',
  }
};

type MegaMenuCategory = 'all' | 'imageTools' | 'pdfTools' | 'calculators' | 'codeTools' | 'textTools' | 'designTools' | 'securityTools';

export default function Header({ lang }: HeaderProps) {
  const { t } = useTranslation({ namespace: 'menu' });
  
  const getText = useCallback((key: string, fallback: string): string => {
    const translated = t(key);
    if (translated && typeof translated === 'string' && translated !== key) {
      return translated;
    }
    if (headerTranslations[lang]?.[key]) {
      return headerTranslations[lang][key];
    }
    if (headerTranslations.en[key]) {
      return headerTranslations.en[key];
    }
    return fallback;
  }, [lang, t]);
  
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const fontButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    themeColors, 
    isDarkMode, 
    toggleDarkMode, 
    fontFamily, 
    setFontFamily, 
    availableFonts, 
    theme, 
    setTheme, 
    availableThemes 
  } = useTheme();

  const megaMenuCategories: MegaMenuCategory[] = [
    'all',
    // 'imageTools',   // ❌ COMMENTED - HIDE
    // 'pdfTools',     // ❌ COMMENTED - HIDE
    // 'calculators',  // ❌ COMMENTED - HIDE
    // 'codeTools',    // ❌ COMMENTED - HIDE
    // 'textTools',    // ❌ COMMENTED - HIDE
    // 'designTools',  // ❌ COMMENTED - HIDE
    // 'securityTools',// ❌ COMMENTED - HIDE
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (isFontMenuOpen && 
          fontButtonRef.current && 
          !fontButtonRef.current.contains(target) && 
          fontMenuRef.current && 
          !fontMenuRef.current.contains(target)) {
        setIsFontMenuOpen(false);
      }
      
      if (isThemeMenuOpen && 
          themeButtonRef.current && 
          !themeButtonRef.current.contains(target) && 
          themeMenuRef.current && 
          !themeMenuRef.current.contains(target)) {
        setIsThemeMenuOpen(false);
      }

      if (isUserMenuOpen &&
          userMenuRef.current &&
          !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFontMenuOpen, isThemeMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFontMenuOpen(false);
        setIsThemeMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDashboard = useCallback(() => {
    setIsDashboardOpen(!isDashboardOpen);
  }, [isDashboardOpen]);

  const toggleFontMenu = useCallback(() => {
    setIsFontMenuOpen(!isFontMenuOpen);
    setIsThemeMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [isFontMenuOpen]);

  const toggleThemeMenu = useCallback(() => {
    setIsThemeMenuOpen(!isThemeMenuOpen);
    setIsFontMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [isThemeMenuOpen]);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsFontMenuOpen(false);
    setIsThemeMenuOpen(false);
  }, [isUserMenuOpen]);

  const handleFontChange = (fontValue: string) => {
    setFontFamily(fontValue);
    setIsFontMenuOpen(false);
  };

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as any);
    setIsThemeMenuOpen(false);
  };

  return (
    <>
      <header 
        className="header-container"
        style={{
          transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isHeaderVisible ? 1 : 0,
          backgroundColor: `${themeColors.background}ee`,
          borderBottom: `1px solid ${themeColors.border}30`,
        }}
      >
        <div className="responsive-container">
          <div className="header-inner">
            
           {/* LOGO */}
<div className="logo-container">
  <Link href={`/${lang}`} className="logo-link">
    <Image
      src="/centre.com.pk.jpeg"
      alt="Centre.com.pk - Free Online Tools"
      width={140}
      height={40}
      className="logo-image"
      priority
      style={{ objectFit: 'contain' }}
    />
  </Link>
</div>

            {/* DESKTOP NAVIGATION */}
            <nav className="desktop-nav">
              <div className="desktop-nav-inner">
                {/* HOME BUTTON */}
                <Link 
                  href={`/${lang}`} 
                  className="home-button"
                  style={{ 
                    color: themeColors.text.primary,
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.surface,
                  }}
                >
                  <Home className="home-icon" />
                  <span>{getText('menu.home', 'Home')}</span>
                </Link>
                
                {/* TOOLS MEGA MENU */}
                {megaMenuCategories.map((category) => (
                  <div key={category} className="mega-menu-item">
                    <MegaMenu category={category} lang={lang} />
                  </div>
                ))}

                {/* ✅ BLOG BUTTON — NEW! */}
                <Link 
                  href={`/${lang}/blog`} 
                  className="home-button"
                  style={{ 
                    color: themeColors.text.primary,
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.surface,
                  }}
                >
                  <BookOpen className="home-icon" />
                  <span>{getText('menu.blog', 'Blog')}</span>
                </Link>
              </div>
            </nav>

            {/* RIGHT CONTROLS */}
            <div className="header-controls">
              
              <LanguageSwitcher lang={lang} />

              {/* USER MENU */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="control-button"
                  style={{
                    backgroundColor: isUserMenuOpen ? `${themeColors.primary}15` : themeColors.surface,
                    color: themeColors.text.primary,
                    borderColor: isUserMenuOpen ? themeColors.primary : themeColors.border,
                  }}
                  aria-label={getText('aria.user', 'User menu')}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="control-icon" />
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 py-2"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                    }}
                  >
                    <Link 
                      href={`/${lang}/auth/signin`} 
                      onClick={() => setIsUserMenuOpen(false)} 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:opacity-80 font-medium" 
                      style={{ color: themeColors.text.primary }}
                    >
                      🔑 {getText('action.signin', 'Sign In')}
                    </Link>
                    <Link 
                      href={`/${lang}/auth/signup`} 
                      onClick={() => setIsUserMenuOpen(false)} 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:opacity-80 font-semibold" 
                      style={{ color: themeColors.primary }}
                    >
                      ✨ {getText('action.signup', 'Create Account')}
                    </Link>
                  </div>
                )}
              </div>

              {/* FONT SELECTOR */}
              <div className="font-control-wrapper">
                <button
                  ref={fontButtonRef}
                  onClick={toggleFontMenu}
                  className="font-btn control-button"
                  style={{
                    backgroundColor: isFontMenuOpen ? `${themeColors.primary}15` : themeColors.surface,
                    color: themeColors.text.primary,
                    borderColor: isFontMenuOpen ? themeColors.primary : themeColors.border,
                  }}
                  title={getText('action.theme', 'Theme')}
                  aria-label="Select font"
                  aria-expanded={isFontMenuOpen}
                  aria-haspopup="true"
                >
                  <Type className="control-icon" />
                </button>

                {isFontMenuOpen && (
                  <div 
                    ref={fontMenuRef}
                    className="font-dropdown"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                    }}
                  >
                    <div className="dropdown-content">
                      {availableFonts.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => handleFontChange(font.value)}
                          className="font-option"
                          style={{
                            backgroundColor: fontFamily === font.value ? `${themeColors.primary}15` : 'transparent',
                            color: fontFamily === font.value ? themeColors.primary : themeColors.text.primary,
                            fontFamily: font.value,
                          }}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DARK MODE TOGGLE */}
              <button
                onClick={toggleDarkMode}
                className="control-button"
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text.primary,
                  borderColor: themeColors.border,
                }}
                title={isDarkMode ? getText('action.light', 'Light Mode') : getText('action.dark', 'Dark Mode')}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="control-icon" />
                ) : (
                  <Moon className="control-icon" />
                )}
              </button>

              {/* THEME SELECTOR */}
              <div className="theme-control-wrapper">
                <button
                  ref={themeButtonRef}
                  onClick={toggleThemeMenu}
                  className="theme-btn control-button"
                  style={{
                    backgroundColor: isThemeMenuOpen ? `${themeColors.primary}15` : themeColors.surface,
                    color: themeColors.text.primary,
                    borderColor: isThemeMenuOpen ? themeColors.primary : themeColors.border,
                  }}
                  title={getText('action.theme', 'Theme')}
                  aria-expanded={isThemeMenuOpen}
                  aria-haspopup="true"
                >
                  <Palette className="control-icon" />
                </button>

                {isThemeMenuOpen && (
                  <div 
                    ref={themeMenuRef}
                    className="theme-dropdown"
                    style={{
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                    }}
                  >
                    <div className="dropdown-content">
                      <div className="dropdown-header" 
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                        {getText('action.theme', 'Theme')}
                      </div>
                      {availableThemes.map((themeItem) => (
                        <button
                          key={themeItem.value}
                          onClick={() => handleThemeChange(themeItem.value)}
                          className="theme-option"
                          style={{
                            backgroundColor: theme === themeItem.value ? `${themeColors.primary}15` : 'transparent',
                            color: theme === themeItem.value ? themeColors.primary : themeColors.text.primary,
                          }}
                        >
                          <div className="theme-option-inner">
                            <div 
                              className="theme-indicator"
                              style={{ 
                                borderColor: themeColors.border,
                                background: theme === themeItem.value 
                                  ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                                  : themeColors.surface
                              }}
                            />
                            <span>{themeItem.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE MENU */}
              <button
                onClick={toggleDashboard}
                className="mobile-menu-button control-button"
                style={{
                  color: themeColors.text.primary,
                  backgroundColor: `${themeColors.primary}10`,
                  borderColor: themeColors.border,
                }}
                aria-label={getText('aria.menu', 'Open menu')}
              >
                <Menu className="control-icon" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDashboard 
        isOpen={isDashboardOpen} 
        onClose={() => setIsDashboardOpen(false)}
        lang={lang}
      />
    </>
  );
}