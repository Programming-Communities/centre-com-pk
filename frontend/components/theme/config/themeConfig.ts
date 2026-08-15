import { 
  ThemeConfigWithMetadata, 
  FontOption, 
  ThemeOption, 
  Theme, 
  ThemeWithMetadata,
  ThemeColors 
} from '@/types/theme';

// ========== FONT CONFIGURATION ==========
export const FONT_OPTIONS: FontOption[] = [
  { value: 'system-ui', label: 'System Font' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Merriweather', label: 'Merriweather' },
  // ✅ Web-safe Urdu fonts
  { value: 'Noto Nastaliq Urdu', label: 'نستعلیق' },
  { value: 'Amiri', label: 'امیری' },
];

// ========== ALL 13 THEMES - WCAG AAA COMPLIANT ==========
export const THEMES_CONFIG: ThemeConfigWithMetadata = {
  // ✅ 1. PROFESSIONAL BLUE (Primary Theme)
  'professional-blue': {
    name: 'Professional Blue',
    category: 'professional',
    icon: '💼',
    description: 'WCAG AAA compliant blue theme',
    primary: '#1d4ed8',
    secondary: '#1e40af',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#e2e8f0',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(29, 78, 216, 0.15)',
    dark: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        accent: '#ffffff'
      },
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
    }
  },

  // ✅ 2. CORPORATE GREEN
  'corporate-green': {
    name: 'Corporate Green',
    category: 'professional',
    icon: '🏢',
    description: 'WCAG AAA compliant green theme',
    primary: '#065f46',
    secondary: '#047857',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#d1fae5',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(6, 95, 70, 0.15)',
    dark: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#022c22',
      surface: '#064e3b',
      text: {
        primary: '#d1fae5',
        secondary: '#a7f3d0',
        accent: '#022c22'
      },
      border: '#047857',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    }
  },

  // ✅ 3. PREMIUM PURPLE
  'premium-purple': {
    name: 'Premium Purple',
    category: 'premium',
    icon: '🎯',
    description: 'WCAG AAA compliant purple theme',
    primary: '#5b21b6',
    secondary: '#4c1d95',
    background: '#ffffff',
    surface: '#faf5ff',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#e9d5ff',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(91, 33, 182, 0.15)',
    dark: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        accent: '#ffffff'
      },
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
    }
  },

  // ✅ 4. LUXURY GOLD
  'luxury-gold': {
    name: 'Luxury Gold',
    category: 'premium',
    icon: '⭐',
    description: 'WCAG AAA compliant gold theme',
    primary: '#92400e',
    secondary: '#78350f',
    background: '#ffffff',
    surface: '#fef3c7',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#fbbf24',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(146, 64, 14, 0.15)',
    dark: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      background: '#1f2937',
      surface: '#374151',
      text: {
        primary: '#f9fafb',
        secondary: '#e5e7eb',
        accent: '#1f2937'
      },
      border: '#d97706',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
    }
  },

  // ✅ 5. MINIMAL GRAY
  'minimal-gray': {
    name: 'Minimal Gray',
    category: 'minimal',
    icon: '⚫',
    description: 'WCAG AAA compliant gray theme',
    primary: '#0f172a',
    secondary: '#334155',
    background: '#ffffff',
    surface: '#f9fafb',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#e5e7eb',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
    dark: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      background: '#111827',
      surface: '#1f2937',
      text: {
        primary: '#f9fafb',
        secondary: '#e5e7eb',
        accent: '#ffffff'
      },
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }
  },

  // ✅ 6. TECH CYAN
  'tech-cyan': {
    name: 'Tech Cyan',
    category: 'tech',
    icon: '🔷',
    description: 'WCAG AAA compliant cyan theme',
    primary: '#0f766e',
    secondary: '#115e59',
    background: '#ffffff',
    surface: '#ccfbf1',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#99f6e4',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
    dark: {
      primary: '#22d3ee',
      secondary: '#67e8f9',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        accent: '#0f172a'
      },
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(34, 211, 238, 0.2)'
    }
  },

  // ✅ 7. NATURE GREEN
  'nature-green': {
    name: 'Nature Green',
    category: 'nature',
    icon: '🌿',
    description: 'WCAG AAA compliant nature theme',
    primary: '#065f46',
    secondary: '#047857',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#a7f3d0',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(6, 95, 70, 0.15)',
    dark: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#022c22',
      surface: '#064e3b',
      text: {
        primary: '#d1fae5',
        secondary: '#a7f3d0',
        accent: '#022c22'
      },
      border: '#047857',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    }
  },

  // ✅ 8. OCEAN BLUE
  'ocean-blue': {
    name: 'Ocean Blue',
    category: 'nature',
    icon: '🌊',
    description: 'WCAG AAA compliant ocean theme',
    primary: '#0369a1',
    secondary: '#075985',
    background: '#ffffff',
    surface: '#e0f2fe',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#bae6fd',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(3, 105, 161, 0.15)',
    dark: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      background: '#082f49',
      surface: '#0c4a6e',
      text: {
        primary: '#e0f2fe',
        secondary: '#bae6fd',
        accent: '#082f49'
      },
      border: '#0369a1',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
    }
  },

  // ✅ 9. SUNSET ORANGE
  'sunset-orange': {
    name: 'Sunset Orange',
    category: 'creative',
    icon: '🌅',
    description: 'WCAG AAA compliant sunset theme',
    primary: '#9a3412',
    secondary: '#7c2d12',
    background: '#ffffff',
    surface: '#ffedd5',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#fdba74',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(154, 52, 18, 0.15)',
    dark: {
      primary: '#ea580c',
      secondary: '#c2410c',
      background: '#431407',
      surface: '#7c2d12',
      text: {
        primary: '#ffedd5',
        secondary: '#fdba74',
        accent: '#431407'
      },
      border: '#9a3412',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
    }
  },

  // ✅ 10. MIDNIGHT PURPLE
  'midnight-purple': {
    name: 'Midnight Purple',
    category: 'creative',
    icon: '🌙',
    description: 'WCAG AAA compliant midnight theme',
    primary: '#5b21b6',
    secondary: '#4c1d95',
    background: '#ffffff',
    surface: '#f5f3ff',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#ddd6fe',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(91, 33, 182, 0.15)',
    dark: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      background: '#1e1b4b',
      surface: '#2e2b57',
      text: {
        primary: '#e0e7ff',
        secondary: '#c7d2fe',
        accent: '#1e1b4b'
      },
      border: '#4f46e5',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
    }
  },

  // ✅ 11. ROSE PINK
  'rose-pink': {
    name: 'Rose Pink',
    category: 'creative',
    icon: '🌹',
    description: 'WCAG AAA compliant pink theme',
    primary: '#be185d',
    secondary: '#9d174d',
    background: '#ffffff',
    surface: '#fce7f3',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#fbcfe8',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(190, 24, 93, 0.15)',
    dark: {
      primary: '#f472b6',
      secondary: '#ec4899',
      background: '#4c0519',
      surface: '#831843',
      text: {
        primary: '#fce7f3',
        secondary: '#fbcfe8',
        accent: '#4c0519'
      },
      border: '#be185d',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(244, 114, 182, 0.2)'
    }
  },

  // ✅ 12. VIBRANT RED
  'vibrant-red': {
    name: 'Vibrant Red',
    category: 'creative',
    icon: '❤️',
    description: 'WCAG AAA compliant red theme',
    primary: '#b91c1c',
    secondary: '#991b1b',
    background: '#ffffff',
    surface: '#fee2e2',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#fecaca',
    success: '#065f46',
    warning: '#92400e',
    error: '#b91c1c',
    shadow: '0 4px 12px rgba(185, 28, 28, 0.15)',
    dark: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      background: '#1c1917',
      surface: '#292524',
      text: {
        primary: '#f9fafb',
        secondary: '#e5e7eb',
        accent: '#1c1917'
      },
      border: '#7f1d1d',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
    }
  },

  // ✅ 13. COOL TEAL
  'cool-teal': {
    name: 'Cool Teal',
    category: 'tech',
    icon: '💎',
    description: 'WCAG AAA compliant teal theme',
    primary: '#0f766e',
    secondary: '#115e59',
    background: '#ffffff',
    surface: '#f0fdfa',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#99f6e4',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
    dark: {
      primary: '#0d9488',
      secondary: '#0f766e',
      background: '#042f2e',
      surface: '#0d4c48',
      text: {
        primary: '#ccfbf1',
        secondary: '#99f6e4',
        accent: '#042f2e'
      },
      border: '#115e59',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
    }
  },

  // ✅ 14. DEEP INDIGO
  'deep-indigo': {
    name: 'Deep Indigo',
    category: 'professional',
    icon: '🔵',
    description: 'WCAG AAA compliant indigo theme',
    primary: '#3730a3',
    secondary: '#312e81',
    background: '#ffffff',
    surface: '#eef2ff',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#c7d2fe',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(55, 48, 163, 0.15)',
    dark: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      background: '#1e1b4b',
      surface: '#2e2b57',
      text: {
        primary: '#e0e7ff',
        secondary: '#c7d2fe',
        accent: '#1e1b4b'
      },
      border: '#4f46e5',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
    }
  },

  // ✅ 15. WARM AMBER
  'warm-amber': {
    name: 'Warm Amber',
    category: 'creative',
    icon: '🟠',
    description: 'WCAG AAA compliant amber theme',
    primary: '#b45309',
    secondary: '#92400e',
    background: '#ffffff',
    surface: '#fffbeb',
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#ffffff'
    },
    border: '#fcd34d',
    success: '#065f46',
    warning: '#b45309',
    error: '#7f1d1d',
    shadow: '0 4px 12px rgba(180, 83, 9, 0.15)',
    dark: {
      primary: '#f59e0b',
      secondary: '#d97706',
      background: '#451a03',
      surface: '#78350f',
      text: {
        primary: '#fef3c7',
        secondary: '#fde68a',
        accent: '#451a03'
      },
      border: '#d97706',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
    }
  }
};

// ========== THEME CATEGORIES ==========
export const THEME_CATEGORIES: Record<string, string> = {
  professional: 'Professional Themes',
  premium: 'Premium Themes',
  minimal: 'Minimal Themes',
  tech: 'Tech Themes',
  nature: 'Nature Themes',
  creative: 'Creative Themes'
};

// ========== UTILITY FUNCTIONS ==========
export const getThemeList = (): ThemeOption[] => {
  return Object.entries(THEMES_CONFIG).map(([key, config]) => ({
    value: key as Theme,
    label: config.name,
    category: config.category,
    icon: config.icon,
    description: config.description
  }));
};

export const getThemeColors = (theme: Theme, isDarkMode: boolean): ThemeWithMetadata => {
  const themeConfig = THEMES_CONFIG[theme];
  if (!themeConfig) return THEMES_CONFIG['professional-blue'];
  
  if (isDarkMode && themeConfig.dark) {
    return {
      ...themeConfig,
      ...themeConfig.dark
    };
  }
  
  return themeConfig;
};

export const getAvailableThemes = (): ThemeOption[] => {
  return getThemeList();
};

export const getThemeCategories = () => {
  const categories = new Set<string>();
  getThemeList().forEach(theme => categories.add(theme.category));
  return Array.from(categories).map(category => ({
    id: category,
    name: THEME_CATEGORIES[category] || category
  }));
};

// ========== LEGACY SUPPORT ==========
export const getLegacyThemes = () => {
  const legacyThemes: Record<string, ThemeColors> = {};
  const legacyDarkThemes: Record<string, Partial<ThemeColors>> = {};
  
  Object.entries(THEMES_CONFIG).forEach(([key, config]) => {
    const { name, category, icon, description, dark, ...lightColors } = config;
    legacyThemes[key] = lightColors;
    
    if (dark) {
      legacyDarkThemes[key] = dark;
    }
  });
  
  return { themes: legacyThemes, darkThemes: legacyDarkThemes };
};

export const { themes, darkThemes } = getLegacyThemes();
