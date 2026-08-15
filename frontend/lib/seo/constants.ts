// lib/seo/constants.ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.centre.com.pk';
export const SITE_NAME = 'Centre.com.pk - Free Online Tools';
export const SITE_DESCRIPTION = 'Free online tools for developers, designers, students, and professionals. Calculators, converters, formatters, and more!';
export const SITE_KEYWORDS = 'online tools, free tools, calculators, converters, formatters, developers, designers, utilities';
export const SITE_AUTHOR = 'Centre.com.pk';
export const SITE_TWITTER_HANDLE = '@centerspk';

// ✅ ADDED: Default language
export const DEFAULT_LANG = 'en';
export const VALID_LANGS = ['en', 'ur', 'hi', 'ar'] as const;

export const CATEGORY_NAMES: Record<string, string> = {
  calculators: 'Calculators',
  'code-tools': 'Code Tools',
  'image-tools': 'Image Tools',
  'pdf-tools': 'PDF Tools',
  'text-tools': 'Text Tools'
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  calculators: 'Free online calculators for finance, health, date, and unit conversions',
  'code-tools': 'Tools for developers including formatters, validators, and code generators',
  'image-tools': 'Edit, convert, compress, and enhance images online for free',
  'pdf-tools': 'Manipulate PDF files - compress, merge, split, and convert PDFs',
  'text-tools': 'Text manipulation, formatting, counting, and conversion tools'
};

export const DEFAULT_CHANGEFREQ = 'weekly';
export const DEFAULT_PRIORITY = 0.7;
export const HOME_PRIORITY = 1.0;
export const CATEGORY_PRIORITY = 0.8;
export const TOOL_PRIORITY = 0.7;