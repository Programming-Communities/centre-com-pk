import { SITE_URL } from './constants';
import { ToolSEOData, SitemapEntry } from './types';

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function generateCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function generateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}

export function generateSitemapEntry(
  path: string,
  priority: number,
  changefreq: string = 'weekly',
  lastMod: Date = new Date()
): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: lastMod.toISOString(),
    changefreq,
    priority
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateMetaKeywords(toolData: ToolSEOData): string {
  const baseKeywords = [...toolData.keywords];
  const categoryKeywords = [`${toolData.category} tools`, `online ${toolData.category}`];
  const siteKeywords = ['free online tools', 'centre.com.pk', 'web utilities'];
  
  return [...baseKeywords, ...categoryKeywords, ...siteKeywords]
    .slice(0, 10)
    .join(', ');
}

export function getToolUrl(toolSlug: string, category: string): string {
  return `/tools/${category}/${toolSlug}`;
}

export function getCategoryUrl(category: string): string {
  return `/tools/${category}`;
}

export function getThemeFromUrl(url?: string): string {
  if (!url && typeof window !== 'undefined') {
    url = window.location.href;
  }
  
  if (!url) return 'professional-blue';
  
  try {
    const urlObj = new URL(url);
    const theme = urlObj.searchParams.get('theme');
    return theme || 'professional-blue';
  } catch {
    return 'professional-blue';
  }
}

export function generateThemeOgImageUrl(theme: string = 'professional-blue', title?: string, description?: string): string {
  const themeColors = getThemeColors(theme);
  const params = new URLSearchParams();
  
  params.set('theme', theme);
  params.set('color', themeColors.color);
  params.set('textColor', themeColors.textColor);
  params.set('accentColor', themeColors.accentColor);
  params.set('themeName', themeColors.theme);
  
  if (title) {
    params.set('title', title.substring(0, 100));
  }
  
  if (description) {
    params.set('description', description.substring(0, 200));
  }
  
  return `${SITE_URL}/api/og-image?${params.toString()}`;
}

export function getThemeColors(theme: string = 'professional-blue'): {
  theme: string;
  color: string;
  textColor: string;
  accentColor: string;
} {
  const themeColors: Record<string, { theme: string; color: string; textColor: string; accentColor: string }> = {
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
  
  return themeColors[theme] || themeColors['professional-blue'];
}

export function extractThemeFromSearchParams(searchParams: { theme?: string }): string {
  return searchParams?.theme || 'professional-blue';
}

export function addThemeToUrl(url: string, theme: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('theme', theme);
    return urlObj.toString();
  } catch {
    return url;
  }
}

export function isSocialMediaBot(userAgent?: string): boolean {
  if (!userAgent && typeof window !== 'undefined' && window.navigator) {
    userAgent = window.navigator.userAgent;
  }
  
  if (!userAgent) return false;
  
  const bots = [
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'TelegramBot',
    'Slackbot',
    'Discordbot',
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Applebot'
  ];
  
  return bots.some(bot => userAgent!.toLowerCase().includes(bot.toLowerCase()));
}