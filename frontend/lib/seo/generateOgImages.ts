// lib/seo/generateOgImages.ts
import { SITE_URL } from './constants';

export interface ThemeOgImage {
  theme: string;
  color: string;
  textColor: string;
  accentColor: string;
}

// Theme color mapping for OG images
export const THEME_OG_COLORS: Record<string, ThemeOgImage> = {
  'professional-blue': {
    theme: 'Professional Blue',
    color: '#2563eb',
    textColor: '#ffffff',
    accentColor: '#60a5fa'
  },
  'corporate-green': {
    theme: 'Corporate Green',
    color: '#059669',
    textColor: '#ffffff',
    accentColor: '#10b981'
  },
  'creative-purple': {
    theme: 'Creative Purple',
    color: '#7c3aed',
    textColor: '#ffffff',
    accentColor: '#a78bfa'
  },
  'modern-pink': {
    theme: 'Modern Pink',
    color: '#db2777',
    textColor: '#ffffff',
    accentColor: '#f472b6'
  },
  'minimal-gray': {
    theme: 'Minimal Gray',
    color: '#4b5563',
    textColor: '#ffffff',
    accentColor: '#9ca3af'
  },
  'vibrant-orange': {
    theme: 'Vibrant Orange',
    color: '#ea580c',
    textColor: '#ffffff',
    accentColor: '#fb923c'
  },
  'elegant-teal': {
    theme: 'Elegant Teal',
    color: '#0d9488',
    textColor: '#ffffff',
    accentColor: '#5eead4'
  },
  'royal-gold': {
    theme: 'Royal Gold',
    color: '#ca8a04',
    textColor: '#000000',
    accentColor: '#fde047'
  },
  'nature-green': {
    theme: 'Nature Green',
    color: '#16a34a',
    textColor: '#ffffff',
    accentColor: '#4ade80'
  },
  'ocean-blue': {
    theme: 'Ocean Blue',
    color: '#0284c7',
    textColor: '#ffffff',
    accentColor: '#38bdf8'
  },
  'sunset-red': {
    theme: 'Sunset Red',
    color: '#dc2626',
    textColor: '#ffffff',
    accentColor: '#f87171'
  },
  'midnight-purple': {
    theme: 'Midnight Purple',
    color: '#6b21a8',
    textColor: '#ffffff',
    accentColor: '#c084fc'
  },
  'cyberpunk-neon': {
    theme: 'Cyberpunk Neon',
    color: '#00ff88',
    textColor: '#000000',
    accentColor: '#ff00ff'
  },
  'classic-black': {
    theme: 'Classic Black',
    color: '#000000',
    textColor: '#ffffff',
    accentColor: '#666666'
  }
};

// ✅ NEW: Language-specific colors
export const LANG_COLORS: Record<string, string> = {
  en: '#2563eb', // English - Blue
  ur: '#059669', // Urdu - Green
  hi: '#ea580c', // Hindi - Orange
  ar: '#7c3aed', // Arabic - Purple
};

// ✅ NEW: Language display names for OG image
export const LANG_NAMES: Record<string, string> = {
  en: 'English',
  ur: 'اردو',
  hi: 'हिन्दी',
  ar: 'العربية',
};

/**
 * Get the base OG image API URL
 */
export function getThemeOgImageUrl(): string {
  return `${SITE_URL}/api/og-image`;
}

/**
 * ✅ UPDATED: Generate dynamic OG image URL with LANG support
 */
export function generateOgImageUrl(
  pageType: 'tool' | 'category' | 'home' | 'blog',
  options?: {
    slug?: string;
    title?: string;
    description?: string;
    color?: string;
    lang?: string; // ✅ NEW: Language parameter
  }
): string {
  const params = new URLSearchParams();
  
  // ✅ ADD LANGUAGE PARAMETER - This is the key change!
  if (options?.lang) {
    params.set('lang', options.lang);
  }
  
  // Add title if provided
  if (options?.title) {
    params.set('title', options.title);
  } else if (pageType === 'home') {
    const homeTitle = options?.lang === 'ur' ? 'Centre.com.pk - 500+ مفت آن لائن ٹولز' :
                      options?.lang === 'hi' ? 'Centre.com.pk - 500+ मुफ्त ऑनलाइन टूल्स' :
                      options?.lang === 'ar' ? 'Centre.com.pk - 500+ أدوات مجانية عبر الإنترنت' :
                      'Centre.com.pk - 500+ Free Online Tools';
    params.set('title', homeTitle);
  }
  
  // Add description if provided
  if (options?.description) {
    params.set('description', options.description);
  } else if (pageType === 'home') {
    const homeDesc = options?.lang === 'ur' ? '500+ مفت آن لائن کیلکولیٹرز اور ٹولز تک رسائی حاصل کریں۔ 100% مفت، کوئی رجسٹریشن نہیں۔' :
                     options?.lang === 'hi' ? '500+ मुफ्त ऑनलाइन कैलकुलेटर और टूल्स तक पहुंचें। 100% मुफ्त, कोई पंजीकरण नहीं।' :
                     options?.lang === 'ar' ? 'الوصول إلى 500+ آلة حاسبة وأدوات مجانية عبر الإنترنت. 100% مجاني، بدون تسجيل.' :
                     'Access 500+ free online calculators and tools. 100% free, no registration.';
    params.set('description', homeDesc);
  }
  
  // Add tool name for tool pages
  if (pageType === 'tool' && options?.slug) {
    const formattedToolName = options.slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    params.set('toolName', formattedToolName);
  }
  
  // Add category for category pages
  if (pageType === 'category' && options?.slug) {
    params.set('category', options.slug);
  }
  
  // Add blog slug for blog pages
  if (pageType === 'blog' && options?.slug) {
    params.set('title', options.title || options.slug);
    params.set('description', options.description || 'Read more on Centre.com.pk blog');
  }
  
  // Add color if provided
  if (options?.color) {
    params.set('color', options.color);
  } else if (options?.lang && LANG_COLORS[options.lang]) {
    // ✅ NEW: Use language-specific color if no custom color
    params.set('color', LANG_COLORS[options.lang]);
  }
  
  const queryString = params.toString();
  return queryString ? `${SITE_URL}/api/og-image?${queryString}` : `${SITE_URL}/api/og-image`;
}

/**
 * ✅ UPDATED: Get OG image for tool page with lang support
 */
export function getToolOgImageUrl(toolSlug: string, toolTitle?: string, toolDescription?: string, lang?: string): string {
  return generateOgImageUrl('tool', {
    slug: toolSlug,
    title: toolTitle,
    description: toolDescription,
    lang: lang, // ✅ Pass language
  });
}

/**
 * ✅ UPDATED: Get OG image for category page with lang support
 */
export function getCategoryOgImageUrl(categorySlug: string, categoryTitle?: string, lang?: string): string {
  return generateOgImageUrl('category', {
    slug: categorySlug,
    title: categoryTitle || `${categorySlug.replace(/-/g, ' ')} Tools`,
    description: `Free online ${categorySlug.replace(/-/g, ' ')} tools - 100% free, no registration required.`,
    lang: lang, // ✅ Pass language
  });
}

/**
 * ✅ UPDATED: Get OG image for blog page with lang support
 */
export function getBlogOgImageUrl(blogSlug: string, blogTitle?: string, blogDescription?: string, lang?: string): string {
  return generateOgImageUrl('blog', {
    slug: blogSlug,
    title: blogTitle,
    description: blogDescription,
    lang: lang, // ✅ Pass language
  });
}

/**
 * ✅ UPDATED: Get OG image for home page with lang support
 */
export function getHomeOgImageUrl(lang?: string): string {
  return generateOgImageUrl('home', { lang }); // ✅ Pass language
}

/**
 * Get theme color for meta tags
 */
export function getThemeColorForMeta(theme?: string): string {
  if (theme && THEME_OG_COLORS[theme]) {
    return THEME_OG_COLORS[theme].color;
  }
  return '#2563eb'; // Default professional blue
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): string[] {
  return Object.keys(THEME_OG_COLORS);
}

/**
 * Get theme information by name
 */
export function getThemeInfo(themeName: string): ThemeOgImage | undefined {
  return THEME_OG_COLORS[themeName];
}