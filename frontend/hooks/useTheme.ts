'use client';

import { useTheme as useThemeContext } from '@/components/theme/contexts/ThemeContext';

/**
 * useTheme - Hook to access theme state and methods
 *
 * Provides:
 * - theme: Current theme name
 * - themeColors: Current theme colors
 * - isDarkMode: Boolean for dark mode state
 * - fontFamily: Current font family
 * - isInitialized: Whether theme is loaded
 * - lang: Current language
 *
 * Actions:
 * - setTheme(theme: Theme): Change theme
 * - setFontFamily(font: string): Change font
 * - toggleDarkMode(): Toggle dark/light mode
 * - setLang(lang: string): Change language
 * - resetToDefaults(): Reset all theme settings
 *
 * Data:
 * - availableThemes: Array of available themes
 * - themeCategories: Array of theme categories
 * - availableFonts: Array of available fonts
 */

export function useTheme() {
  const context = useThemeContext();

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default useTheme;
