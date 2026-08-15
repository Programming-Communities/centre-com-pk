'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { Theme, ThemeColors, FontOption, ThemeOption } from '@/types/theme';
import {
  THEMES_CONFIG,
  FONT_OPTIONS,
  getThemeColors,
  getAvailableThemes,
  getThemeCategories,
  getThemeList
} from '@/components/theme/config/themeConfig';

interface ThemeContextType {
  // State
  theme: Theme;
  themeColors: ThemeColors;
  fontFamily: string;
  isDarkMode: boolean;
  isInitialized: boolean;
  lang: string;  // ✅ ADDED: Current language
  
  // Actions
  setTheme: (theme: Theme) => void;
  setFontFamily: (font: string) => void;
  toggleDarkMode: () => void;
  setLang: (lang: string) => void;  // ✅ ADDED: Set language
  
  // Data
  availableThemes: ThemeOption[];
  themeCategories: Array<{ id: string; name: string }>;
  availableFonts: FontOption[];
  
  // Utilities
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: Theme = 'professional-blue';
const DEFAULT_FONT = 'system-ui';
const DEFAULT_LANG = 'en';
const STORAGE_KEYS = {
  THEME: 'theme_preference',
  FONT: 'font_preference',
  DARK_MODE: 'dark_mode_preference',
  LANG: 'lang_preference'  // ✅ ADDED: Language storage key
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [themeColors, setThemeColors] = useState<ThemeColors>(() => 
    getThemeColors(DEFAULT_THEME, false)
  );
  const [fontFamily, setFontFamilyState] = useState<string>(DEFAULT_FONT);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lang, setLangState] = useState<string>(DEFAULT_LANG);  // ✅ ADDED: Language state
  
  // Refs
  const isInitializing = useRef<boolean>(false);

  // Memoized data
  const availableThemes = useMemo(() => getAvailableThemes(), []);
  const themeCategories = useMemo(() => getThemeCategories(), []);
  const availableFonts = useMemo(() => FONT_OPTIONS, []);

  // Initialize theme from storage (NO URL PARAMS)
  const initializeTheme = useCallback(() => {
    if (isInitializing.current || typeof window === 'undefined') return;
    
    isInitializing.current = true;

    try {
      // Get language from URL path
      let initialLang = DEFAULT_LANG;
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      if (pathLang === 'ur' || pathLang === 'ar' || pathLang === 'hi') {
        initialLang = pathLang;
      } else {
        initialLang = 'en';
      }
      
      // Get saved preferences
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
      const savedFont = localStorage.getItem(STORAGE_KEYS.FONT);
      const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      
      // Determine initial values (localStorage > default)
      const initialTheme = savedTheme && THEMES_CONFIG[savedTheme] ? savedTheme : DEFAULT_THEME;
      const initialFont = savedFont || DEFAULT_FONT;
      const initialDarkMode = savedDarkMode ? savedDarkMode === 'true' : false;
      const initialLangValue = savedLang || initialLang;
      
      // Apply initial state
      setThemeState(initialTheme);
      setFontFamilyState(initialFont);
      setIsDarkMode(initialDarkMode);
      setLangState(initialLangValue);
      
      // Calculate initial colors
      const colors = getThemeColors(initialTheme, initialDarkMode);
      setThemeColors(colors);
      
      // Apply to DOM
      applyThemeToDOM(colors, initialFont, initialDarkMode);
      
      // Mark as initialized
      setIsInitialized(true);
      
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      // Apply defaults on error
      applyThemeToDOM(
        getThemeColors(DEFAULT_THEME, false),
        DEFAULT_FONT,
        false
      );
      setIsInitialized(true);
    } finally {
      isInitializing.current = false;
    }
  }, []);

  // Apply theme to DOM
  const applyThemeToDOM = useCallback((
    colors: ThemeColors,
    font: string,
    darkMode: boolean
  ) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const body = document.body;
    
    // Apply CSS custom properties
    const cssVariables = {
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--background': colors.background,
      '--surface': colors.surface,
      '--text-primary': colors.text.primary,
      '--text-secondary': colors.text.secondary,
      '--text-accent': colors.text.accent,
      '--border': colors.border,
      '--success': colors.success,
      '--warning': colors.warning,
      '--error': colors.error,
      '--shadow': colors.shadow,
      '--font-family': font
    };
    
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Apply font family
    body.style.fontFamily = font;
    
    // Apply dark/light mode
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Update meta theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', colors.primary);
    }
  }, []);

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    if (!THEMES_CONFIG[newTheme] || newTheme === theme) return;
    
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  }, [theme]);

  // Set font family
  const setFontFamily = useCallback((font: string) => {
    if (font === fontFamily) return;
    
    setFontFamilyState(font);
    localStorage.setItem(STORAGE_KEYS.FONT, font);
  }, [fontFamily]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, newDarkMode.toString());
  }, [isDarkMode]);

  // Set language
  const setLang = useCallback((newLang: string) => {
    if (newLang === lang) return;
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  }, [lang]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setThemeState(DEFAULT_THEME);
    setFontFamilyState(DEFAULT_FONT);
    setIsDarkMode(false);
    setLangState(DEFAULT_LANG);
    
    localStorage.setItem(STORAGE_KEYS.THEME, DEFAULT_THEME);
    localStorage.setItem(STORAGE_KEYS.FONT, DEFAULT_FONT);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'false');
    localStorage.setItem(STORAGE_KEYS.LANG, DEFAULT_LANG);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Apply theme changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const colors = getThemeColors(theme, isDarkMode);
    setThemeColors(colors);
    applyThemeToDOM(colors, fontFamily, isDarkMode);
    
  }, [theme, isDarkMode, fontFamily, isInitialized, applyThemeToDOM]);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isInitialized) return;
    
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    localStorage.setItem(STORAGE_KEYS.FONT, fontFamily);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode.toString());
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [theme, fontFamily, isDarkMode, lang, isInitialized]);

  // Listen for language changes from URL
  useEffect(() => {
    if (!isInitialized) return;
    
    const handlePopState = () => {
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      let newLang = DEFAULT_LANG;
      if (pathLang === 'ur' || pathLang === 'ar' || pathLang === 'hi') {
        newLang = pathLang;
      }
      if (newLang !== lang) {
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEYS.LANG, newLang);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isInitialized, lang]);

  // Context value
  const contextValue: ThemeContextType = useMemo(() => ({
    // State
    theme,
    themeColors,
    fontFamily,
    isDarkMode,
    isInitialized,
    lang,  // ✅ ADDED: Expose lang
    
    // Actions
    setTheme,
    setFontFamily,
    toggleDarkMode,
    setLang,  // ✅ ADDED: Expose setLang
    
    // Data
    availableThemes,
    themeCategories,
    availableFonts,
    
    // Utilities
    resetToDefaults
  }), [
    theme,
    themeColors,
    fontFamily,
    isDarkMode,
    isInitialized,
    lang,  // ✅ ADDED: Add to dependencies
    setTheme,
    setFontFamily,
    toggleDarkMode,
    setLang,  // ✅ ADDED: Add to dependencies
    availableThemes,
    themeCategories,
    availableFonts,
    resetToDefaults
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;