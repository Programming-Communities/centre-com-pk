// components/theme/index.ts
export { ThemeProvider, useTheme } from './contexts/ThemeContext';
export { default as ThemeProviderWrapper } from './providers/ThemeProviderWrapper';
export { default as DarkModeToggle } from './ui/DarkModeToggle';
export { default as FontSelector } from './ui/FontSelector';
export { default as ThemeSelector } from './ui/ThemeSelector';
export { default as ThemeSettingsButton } from './ui/ThemeSettingsButton';
export { default as ThemeInfo } from './ui/ThemeInfo';

// Export types
export type { 
  Theme, 
  ThemeColors, 
  FontOption, 
  ThemeOption, 
  ThemePreferences 
} from './types/theme.types';

// Export config (all from themeConfig.ts)
export { 
  THEMES_CONFIG, 
  FONT_OPTIONS, 
  THEME_CATEGORIES, 
  getThemeList, 
  getThemeColors, 
  getAvailableThemes, 
  getThemeCategories 
} from './config/themeConfig';

// Export utils
export { 
  getCurrentTheme, 
  saveThemePreferences, 
  applyTheme, 
  toggleDarkMode, 
  changeFontFamily 
} from './utils/theme-utils';