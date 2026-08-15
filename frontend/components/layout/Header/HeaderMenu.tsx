"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, User, Home, Info, Mail, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import { useTranslation, setGlobalLang } from '@/hooks/useTranslation';

interface HeaderMenuProps {
  mobile?: boolean;
  showDashboardToggle?: boolean;
  lang?: string;
}

// ✅ COMPLETE TRANSLATIONS - All languages
const menuTranslations: Record<string, Record<string, string>> = {
  ur: {
    'menu.home': 'ہوم',
    'menu.about': 'ہمارے بارے میں',
    'menu.contact': 'رابطہ کریں',
    'menu.tools': 'ٹولز',
    'menu.all_tools': 'تمام ٹولز',
    'menu.image_tools': 'امیج ٹولز',
    'menu.pdf_tools': 'پی ڈی ایف ٹولز',
    'menu.code_tools': 'کوڈ ٹولز',
    'menu.text_tools': 'ٹیکسٹ ٹولز',
    'menu.security_tools': 'سیکیورٹی ٹولز',
    'menu.design_tools': 'ڈیزائن ٹولز',
    'menu.calculators': 'کیلکولیٹرز',
    'action.search': 'تلاش کریں',
    'action.signin': 'سائن ان',
    'action.dashboard': 'ڈیش بورڈ',
    'navigation.title': 'نیویگیشن',
  },
  ar: {
    'menu.home': 'الرئيسية',
    'menu.about': 'عن الموقع',
    'menu.contact': 'اتصل بنا',
    'menu.tools': 'الأدوات',
    'menu.all_tools': 'جميع الأدوات',
    'menu.image_tools': 'أدوات الصور',
    'menu.pdf_tools': 'أدوات PDF',
    'menu.code_tools': 'أدوات البرمجة',
    'menu.text_tools': 'أدوات النص',
    'menu.security_tools': 'أدوات الأمان',
    'menu.design_tools': 'أدوات التصميم',
    'menu.calculators': 'الآلات الحاسبة',
    'action.search': 'بحث',
    'action.signin': 'تسجيل الدخول',
    'action.dashboard': 'لوحة التحكم',
    'navigation.title': 'القائمة',
  },
  hi: {
    'menu.home': 'होम',
    'menu.about': 'हमारे बारे में',
    'menu.contact': 'संपर्क करें',
    'menu.tools': 'टूल्स',
    'menu.all_tools': 'सभी टूल्स',
    'menu.image_tools': 'इमेज टूल्स',
    'menu.pdf_tools': 'PDF टूल्स',
    'menu.code_tools': 'कोड टूल्स',
    'menu.text_tools': 'टेक्स्ट टूल्स',
    'menu.security_tools': 'सिक्योरिटी टूल्स',
    'menu.design_tools': 'डिज़ाइन टूल्स',
    'menu.calculators': 'कैलकुलेटर',
    'action.search': 'खोजें',
    'action.signin': 'साइन इन',
    'action.dashboard': 'डैशबोर्ड',
    'navigation.title': 'नेविगेशन',
  },
  en: {
    'menu.home': 'Home',
    'menu.about': 'About',
    'menu.contact': 'Contact',
    'menu.tools': 'Tools',
    'menu.all_tools': 'All Tools',
    'menu.image_tools': 'Image Tools',
    'menu.pdf_tools': 'PDF Tools',
    'menu.code_tools': 'Code Tools',
    'menu.text_tools': 'Text Tools',
    'menu.security_tools': 'Security Tools',
    'menu.design_tools': 'Design Tools',
    'menu.calculators': 'Calculators',
    'action.search': 'Search',
    'action.signin': 'Sign In',
    'action.dashboard': 'Dashboard',
    'navigation.title': 'Navigation',
  }
};

export default function HeaderMenu({ mobile = false, showDashboardToggle = false, lang = 'en' }: HeaderMenuProps) {
  // ✅ FIXED: Update global lang when prop changes
  useEffect(() => {
    if (lang && lang !== 'en') {
      setGlobalLang(lang);
    }
  }, [lang]);
  
  const { t } = useTranslation({ namespace: 'menu' });
  
  // ✅ FIXED: Translation helper with proper fallback
  const getText = useCallback((key: string, fallback: string): string => {
    // First try translation hook
    const translated = t(key);
    if (translated && typeof translated === 'string' && translated !== key) {
      return translated;
    }
    // Then try local translations for current lang
    if (menuTranslations[lang]?.[key]) {
      return menuTranslations[lang][key];
    }
    // Fallback to English
    if (menuTranslations.en[key]) {
      return menuTranslations.en[key];
    }
    // Final fallback
    return fallback;
  }, [lang, t]);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { themeColors } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
    const event = new CustomEvent('toggleDashboard', { detail: !isDashboardOpen });
    window.dispatchEvent(event);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${lang}/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSignIn = () => {
    console.log('Sign in clicked');
  };

  // ✅ Complete category links for dropdown
  const toolCategories = [
    { id: 'all', key: 'menu.all_tools', fallback: 'All Tools', path: 'tools' },
    { id: 'calculators', key: 'menu.calculators', fallback: 'Calculators', path: 'tools/calculators' },
    { id: 'image-tools', key: 'menu.image_tools', fallback: 'Image Tools', path: 'tools/image-tools' },
    { id: 'pdf-tools', key: 'menu.pdf_tools', fallback: 'PDF Tools', path: 'tools/pdf-tools' },
    { id: 'code-tools', key: 'menu.code_tools', fallback: 'Code Tools', path: 'tools/code-tools' },
    { id: 'text-tools', key: 'menu.text_tools', fallback: 'Text Tools', path: 'tools/text-tools' },
    { id: 'design-tools', key: 'menu.design_tools', fallback: 'Design Tools', path: 'tools/design-tools' },
    { id: 'security-tools', key: 'menu.security_tools', fallback: 'Security Tools', path: 'tools/security-tools' },
  ];

  if (!mobile) {
    return (
      <div ref={menuRef} className="relative">
        <div className="flex items-center gap-4">
          {showDashboardToggle && (
            <button
              onClick={toggleDashboard}
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: `${themeColors.primary}15`,
                color: themeColors.primary,
                border: `1px solid ${themeColors.primary}30`,
              }}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{getText('action.dashboard', 'Dashboard')}</span>
            </button>
          )}

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href={`/${lang}`} 
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: themeColors.text.primary }}
            >
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>{getText('menu.home', 'Home')}</span>
              </div>
            </Link>
            <Link 
              href={`/${lang}/about`} 
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: themeColors.text.primary }}
            >
              <div className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>{getText('menu.about', 'About')}</span>
              </div>
            </Link>
            <Link 
              href={`/${lang}/contact`} 
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: themeColors.text.primary }}
            >
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{getText('menu.contact', 'Contact')}</span>
              </div>
            </Link>
            
            {/* ✅ FIXED: Tools Dropdown with all categories */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: themeColors.text.primary }}
              >
                <span>{getText('menu.tools', 'Tools')}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                  style={{ 
                    backgroundColor: themeColors.background,
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: `0 10px 25px ${themeColors.primary}10`
                  }}
                >
                  <div className="py-2">
                    {toolCategories.map((cat) => (
                      <Link 
                        key={cat.id}
                        href={`/${lang}/${cat.path}`} 
                        className="block px-4 py-2 text-sm hover:opacity-80 transition-colors"
                        style={{ color: themeColors.text.primary }}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {getText(cat.key, cat.fallback)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 cursor-pointer"
                  style={{ color: themeColors.text.secondary }}
                  onClick={toggleSearch}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={getText('action.search', 'Search') + '...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-300 ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'} md:w-48 md:opacity-100`}
                  style={{ 
                    backgroundColor: themeColors.surface,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                    outline: 'none'
                  }}
                />
              </div>
            </form>
          </div>

          <button
            onClick={() => window.location.href = "/" + lang + "/auth/signin"}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: themeColors.primary,
              color: themeColors.text.accent
            }}
          >
            <User className="h-4 w-4" />
            <span>{getText('action.signin', 'Sign In')}</span>
          </button>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg"
            style={{ color: themeColors.text.primary }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* ✅ FIXED: Mobile Menu with all translations */}
        {isMobileMenuOpen && (
          <div 
            className="absolute top-full right-0 mt-2 w-72 rounded-lg shadow-xl md:hidden z-50"
            style={{ 
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              boxShadow: `0 20px 40px ${themeColors.primary}15`
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: themeColors.text.primary }}>
                  {getText('navigation.title', 'Navigation')}
                </h3>
                <button onClick={toggleMobileMenu} className="p-1 rounded-full" style={{ color: themeColors.text.secondary }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {showDashboardToggle && (
                  <button onClick={() => { toggleDashboard(); toggleMobileMenu(); }}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg w-full text-left"
                    style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{getText('action.dashboard', 'Dashboard')}</span>
                  </button>
                )}
                
                <Link href={`/${lang}`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                  style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
                  <Home className="h-4 w-4" />
                  <span>{getText('menu.home', 'Home')}</span>
                </Link>
                
                <Link href={`/${lang}/about`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                  style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
                  <Info className="h-4 w-4" />
                  <span>{getText('menu.about', 'About')}</span>
                </Link>
                
                <Link href={`/${lang}/contact`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                  style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
                  <Mail className="h-4 w-4" />
                  <span>{getText('menu.contact', 'Contact')}</span>
                </Link>
                
                {/* ✅ FIXED: Mobile tools submenu with all categories */}
                <div className="space-y-1 pt-1">
                  <div className="text-xs font-semibold px-3 py-1" style={{ color: themeColors.text.secondary }}>
                    {getText('menu.tools', 'Tools')}
                  </div>
                  {toolCategories.map((cat) => (
                    <Link 
                      key={cat.id}
                      href={`/${lang}/${cat.path}`} 
                      className="block text-sm px-5 py-2 rounded-lg"
                      style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} 
                      onClick={toggleMobileMenu}
                    >
                      {getText(cat.key, cat.fallback)}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                    <input
                      type="text"
                      placeholder={getText('action.search', 'Search') + '...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary, border: `1px solid ${themeColors.border}` }}
                    />
                  </div>
                </div>
                
                <button onClick={() => { window.location.href = "/" + lang + "/auth/signin"; toggleMobileMenu(); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg mt-2"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
                  <User className="h-4 w-4" />
                  <span>{getText('action.signin', 'Sign In')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ FIXED: Mobile-only version with translations
  return (
    <div ref={menuRef} className="w-full">
      <div className="flex items-center justify-between p-4">
        {showDashboardToggle && (
          <button onClick={toggleDashboard} className="p-2 rounded-lg"
            style={{ color: themeColors.primary, backgroundColor: `${themeColors.primary}15` }}
            aria-label={getText('action.dashboard', 'Dashboard')}>
            <LayoutDashboard className="h-5 w-5" />
          </button>
        )}

        <button onClick={toggleMobileMenu} className="p-2 rounded-lg" style={{ color: themeColors.text.primary }}>
          <Menu className="h-5 w-5" />
        </button>

        <Link href={`/${lang}`} className="text-sm font-bold" style={{ color: themeColors.primary }}>
          Centre.com.pk
        </Link>

        <button onClick={toggleSearch} className="p-2 rounded-lg" style={{ color: themeColors.text.primary }}>
          <Search className="h-5 w-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 shadow-xl z-50 p-4 max-h-[80vh] overflow-y-auto"
          style={{ backgroundColor: themeColors.background, borderTop: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: themeColors.text.primary }}>
              {getText('navigation.title', 'Navigation')}
            </h3>
            <button onClick={toggleMobileMenu} className="p-1 rounded-full" style={{ color: themeColors.text.secondary }}>
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {showDashboardToggle && (
              <button onClick={() => { toggleDashboard(); toggleMobileMenu(); }}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg w-full text-left"
                style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                <LayoutDashboard className="h-4 w-4" />
                <span>{getText('action.dashboard', 'Dashboard')}</span>
              </button>
            )}
            
            <Link href={`/${lang}`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
              <Home className="h-4 w-4" />
              <span>{getText('menu.home', 'Home')}</span>
            </Link>
            
            <Link href={`/${lang}/about`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
              <Info className="h-4 w-4" />
              <span>{getText('menu.about', 'About')}</span>
            </Link>
            
            <Link href={`/${lang}/contact`} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} onClick={toggleMobileMenu}>
              <Mail className="h-4 w-4" />
              <span>{getText('menu.contact', 'Contact')}</span>
            </Link>
            
            {/* ✅ FIXED: Mobile tools submenu with all categories */}
            <div className="space-y-1 pt-1">
              <div className="text-xs font-semibold px-3 py-1" style={{ color: themeColors.text.secondary }}>
                {getText('menu.tools', 'Tools')}
              </div>
              {toolCategories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/${lang}/${cat.path}`} 
                  className="block text-sm px-5 py-2 rounded-lg"
                  style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }} 
                  onClick={toggleMobileMenu}
                >
                  {getText(cat.key, cat.fallback)}
                </Link>
              ))}
            </div>
            
            <div className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
                <input
                  type="text"
                  placeholder={getText('action.search', 'Search') + '...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary, border: `1px solid ${themeColors.border}` }}
                />
              </div>
            </div>
            
            <button onClick={() => { window.location.href = "/" + lang + "/auth/signin"; toggleMobileMenu(); }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-lg mt-2"
              style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
              <User className="h-4 w-4" />
              <span>{getText('action.signin', 'Sign In')}</span>
            </button>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 p-4"
          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: themeColors.text.secondary }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={getText('action.search', 'Search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg text-sm"
                style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary, border: `1px solid ${themeColors.border}` }}
              />
              <button onClick={toggleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: themeColors.text.secondary }}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}