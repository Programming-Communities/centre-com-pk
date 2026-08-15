// theme/utils/theme-utils.ts
import { Theme, ThemePreferences } from '@/components/theme/types/theme.types';
import { THEMES_CONFIG } from '@/components/theme/config/themeConfig';

// Constants (previously missing in constants/themes.ts)
export const THEME_STORAGE_KEY = 'theme_preferences';
export const DEFAULT_THEME = 'professional-blue';

export const getCurrentTheme = (): ThemePreferences | null => {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveThemePreferences = (preferences: ThemePreferences): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
  applyTheme(preferences.theme, preferences.fontFamily);
};

export const applyTheme = (theme: Theme, fontFamily?: string): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Remove all theme classes
  Object.keys(THEMES_CONFIG).forEach(themeName => {
    root.classList.remove(`theme-${themeName}`);
  });
  
  // Add current theme class
  root.classList.add(`theme-${theme}`);
  
  // Apply font family
  if (fontFamily) {
    root.style.setProperty('--font-family', fontFamily);
  }
  
  // Apply theme colors from THEMES_CONFIG
  const themeConfig = THEMES_CONFIG[theme];
  if (themeConfig) {
    // Direct properties (not nested under colors)
    const colorProperties = {
      'primary': themeConfig.primary,
      'secondary': themeConfig.secondary,
      'background': themeConfig.background,
      'surface': themeConfig.surface,
      'border': themeConfig.border,
      'success': themeConfig.success,
      'warning': themeConfig.warning,
      'error': themeConfig.error,
      'shadow': themeConfig.shadow,
      'text-primary': themeConfig.text.primary,
      'text-secondary': themeConfig.text.secondary,
      'text-accent': themeConfig.text.accent
    };
    
    Object.entries(colorProperties).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });
  }
};

export const toggleDarkMode = (currentTheme: Theme): Theme => {
  // Simple toggle - if theme name contains 'dark', remove it; otherwise add it
  const newTheme = currentTheme.includes('dark') 
    ? currentTheme.replace('-dark', '') as Theme
    : `${currentTheme}-dark` as Theme;
  
  return newTheme;
};

export const changeFontFamily = (fontFamily: string): void => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--font-family', fontFamily);
};