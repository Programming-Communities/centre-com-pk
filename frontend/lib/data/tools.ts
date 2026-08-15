// lib/data/tools.ts
// ✅ FIXED: TypeScript error + proper translations
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import { categoryConfig as importedCategoryConfig } from './categoryConfig';
import { getCategoryTranslations as importedCategoryTranslations } from './categoryTranslations';

export interface Tool {
  title: string;
  slug: string;
  category: string;
  description?: string;
  featured?: boolean;
  lastModified?: Date;
  icon?: string;
  color?: string;
}

export interface CategoryConfig {
  slug: string;
  path: string;
  toolCount: number;
  categoryType: string;
  icon?: string;
  color?: string;
}

export interface CategoryTranslation {
  title: string;
  description: string;
}

// Helper function to get icon for category
export function getToolIcon(category: string): string {
  const icons: Record<string, string> = {
    'calculators': '🧮',
    'educational': '🎓',
    'education': '🎓',
    'code-tools': '💻',
    'code': '💻',
    'design-tools': '🎨',
    'design': '🎨',
    'image-tools': '🖼️',
    'image': '🖼️',
    'pdf-tools': '📄',
    'pdf': '📄',
    'text-tools': '📝',
    'text': '📝',
    'security-tools': '🔒',
    'security': '🔒',
    'productivity-tools': '⚡',
    'productivity': '⚡',
    'health-tools': '🏥',
    'health': '🏥',
    'business-tools': '💼',
    'business': '💼',
    'computer-tools': '🖥️',
    'computer': '🖥️',
  };
  
  if (icons[category]) return icons[category];
  
  const categoryLower = category.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (categoryLower.includes(key.split('-')[0])) {
      return icon;
    }
  }
  
  return '🔧';
}

// Helper function to get color for category
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'calculators': 'blue',
    'educational': 'green',
    'education': 'green',
    'code-tools': 'purple',
    'code': 'purple',
    'design-tools': 'pink',
    'design': 'pink',
    'image-tools': 'indigo',
    'image': 'indigo',
    'pdf-tools': 'red',
    'pdf': 'red',
    'text-tools': 'teal',
    'text': 'teal',
    'security-tools': 'orange',
    'security': 'orange',
    'productivity-tools': 'yellow',
    'productivity': 'yellow',
    'health-tools': 'emerald',
    'health': 'emerald',
    'business-tools': 'amber',
    'business': 'amber',
    'computer-tools': 'cyan',
    'computer': 'cyan',
  };
  
  if (colors[category]) return colors[category];
  
  const categoryLower = category.toLowerCase();
  for (const [key, color] of Object.entries(colors)) {
    if (categoryLower.includes(key.split('-')[0])) {
      return color;
    }
  }
  
  return 'gray';
}

// ✅ CACHE for translations
const translationCache: Record<string, Record<string, any>> = {};

// ✅ Helper to load category translations
async function loadCategoryTranslations(lang: string, category: string): Promise<Record<string, any>> {
  const cacheKey = `${lang}/${category}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  if (lang === 'en') {
    return {};
  }
  
  try {
    const module = await import(`@/translations/${lang}/tools/${category}.json`);
    const translations = module.default || module || {};
    translationCache[cacheKey] = translations;
    return translations;
  } catch {
    translationCache[cacheKey] = {};
    return {};
  }
}

// ✅ Helper to get translated tool title
function getTranslatedToolTitle(
  translations: Record<string, any>,
  slug: string,
  defaultTitle: string
): string {
  if (!translations || Object.keys(translations).length === 0) {
    return defaultTitle;
  }
  
  const keyVariations = [
    slug,
    slug.replace(/-/g, '_'),
    slug.replace(/_/g, '-'),
    slug.replace(/-/g, ''),
  ];
  
  for (const key of keyVariations) {
    if (translations[key]?.title) {
      return translations[key].title;
    }
    if (translations[key]?.name) {
      return translations[key].name;
    }
  }
  
  for (const [key, value] of Object.entries(translations)) {
    if (key.includes(slug) || slug.includes(key)) {
      if (value?.title) return value.title;
      if (value?.name) return value.name;
    }
  }
  
  return defaultTitle;
}

// ✅ Helper to get translated tool description
function getTranslatedToolDescription(
  translations: Record<string, any>,
  slug: string,
  defaultDescription: string
): string {
  if (!translations || Object.keys(translations).length === 0) {
    return defaultDescription;
  }
  
  const keyVariations = [
    slug,
    slug.replace(/-/g, '_'),
    slug.replace(/_/g, '-'),
    slug.replace(/-/g, ''),
  ];
  
  for (const key of keyVariations) {
    if (translations[key]?.description) {
      return translations[key].description;
    }
  }
  
  return defaultDescription;
}

// ✅ FIXED: getAllTools with proper translation support
export async function getAllTools(lang: string = 'en'): Promise<Tool[]> {
  const baseTools: Tool[] = Object.values(TOOL_SEO_DATA).map(tool => ({
    title: tool.title,
    slug: tool.slug,
    category: tool.category,
    description: tool.description,
    featured: (tool as any).featured || false,
    lastModified: new Date(),
    icon: getToolIcon(tool.category),
    color: getCategoryColor(tool.category)
  }));
  
  if (lang === 'en') {
    return baseTools;
  }
  
  try {
    // Group tools by category
    const toolsByCategory: Record<string, Tool[]> = {};
    baseTools.forEach(tool => {
      if (!toolsByCategory[tool.category]) {
        toolsByCategory[tool.category] = [];
      }
      toolsByCategory[tool.category].push(tool);
    });
    
    // Load translations and translate tools
    const translatedTools: Tool[] = [];
    
    for (const [category, tools] of Object.entries(toolsByCategory)) {
      const translations = await loadCategoryTranslations(lang, category);
      
      for (const tool of tools) {
        translatedTools.push({
          ...tool,
          title: getTranslatedToolTitle(translations, tool.slug, tool.title),
          description: getTranslatedToolDescription(translations, tool.slug, tool.description || '')
        });
      }
    }
    
    return translatedTools;
  } catch (error) {
    return baseTools;
  }
}

export async function getToolBySlug(slug: string, lang: string = 'en'): Promise<Tool | null> {
  const tools = await getAllTools(lang);
  return tools.find(tool => tool.slug === slug) || null;
}

export async function getToolsByCategory(category: string, lang: string = 'en'): Promise<Tool[]> {
  const tools = await getAllTools(lang);
  return tools.filter(tool => tool.category === category);
}

export async function getToolsGroupedByCategory(lang: string = 'en'): Promise<Record<string, Tool[]>> {
  const tools = await getAllTools(lang);
  const grouped: Record<string, Tool[]> = {};
  
  tools.forEach(tool => {
    const category = tool.category || 'uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(tool);
  });
  
  return grouped;
}

export async function getPopularTools(limit: number = 12, lang: string = 'en'): Promise<Tool[]> {
  const tools = await getAllTools(lang);
  
  const popularSlugs = [
    'age-calculator', 'bmi-calculator', 'password-generator', 'json-formatter',
    'image-compressor', 'qr-code-generator', 'currency-converter', 'pdf-merger',
    'background-remover', 'unit-converter', 'percentage-calculator', 'case-converter'
  ];
  
  const popularTools = popularSlugs
    .map(slug => tools.find(t => t.slug === slug))
    .filter((tool): tool is Tool => tool !== undefined);
  
  const featuredTools = tools.filter(tool => tool.featured && !popularSlugs.includes(tool.slug));
  
  const combined = [...popularTools, ...featuredTools];
  
  if (combined.length < limit) {
    const otherTools = tools.filter(tool => 
      !popularSlugs.includes(tool.slug) && !tool.featured
    );
    combined.push(...otherTools);
  }
  
  return combined.slice(0, limit);
}

export async function getHomepageTools(options?: {
  limit?: number;
  featuredOnly?: boolean;
  excludeCategories?: string[];
  lang?: string;
}): Promise<Tool[]> {
  const { 
    limit = 24, 
    featuredOnly = false,
    excludeCategories = [],
    lang = 'en'
  } = options || {};
  
  let tools = await getAllTools(lang);
  
  if (featuredOnly) {
    tools = tools.filter(tool => tool.featured);
  }
  
  if (excludeCategories.length > 0) {
    tools = tools.filter(tool => !excludeCategories.includes(tool.category));
  }
  
  return tools.slice(0, limit);
}

export async function searchTools(query: string, limit: number = 20, lang: string = 'en'): Promise<Tool[]> {
  const tools = await getAllTools(lang);
  const queryLower = query.toLowerCase();
  
  return tools
    .filter(tool => 
      tool.title.toLowerCase().includes(queryLower) ||
      tool.description?.toLowerCase().includes(queryLower) ||
      tool.category.toLowerCase().includes(queryLower)
    )
    .slice(0, limit);
}

export async function getCategoryStats(lang: string = 'en') {
  const grouped = await getToolsGroupedByCategory(lang);
  
  return Object.entries(grouped).map(([category, tools]) => ({
    category,
    count: tools.length,
    icon: getToolIcon(category),
    color: getCategoryColor(category),
    lastUpdated: new Date(Math.max(...tools.map(t => t.lastModified?.getTime() || 0)))
  }))
  .sort((a, b) => b.count - a.count);
}

export async function getRecentTools(limit: number = 10, lang: string = 'en'): Promise<Tool[]> {
  const tools = await getAllTools(lang);
  
  return tools
    .sort((a, b) => {
      const dateA = a.lastModified?.getTime() || 0;
      const dateB = b.lastModified?.getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}

export async function getRelatedTools(slug: string, limit: number = 6, lang: string = 'en'): Promise<Tool[]> {
  const currentTool = await getToolBySlug(slug, lang);
  if (!currentTool) return [];
  
  const tools = await getAllTools(lang);
  return tools
    .filter(tool => 
      tool.slug !== slug && 
      tool.category === currentTool.category
    )
    .slice(0, limit);
}

export function getCategoryConfig(): CategoryConfig[] {
  return importedCategoryConfig;
}

export function getCategoryTranslations(lang: string = 'en'): Record<string, CategoryTranslation> {
  return importedCategoryTranslations(lang);
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return importedCategoryConfig.find(cat => cat.slug === slug);
}

export function getCategoryTitle(slug: string, lang: string = 'en'): string {
  const translations = importedCategoryTranslations(lang);
  return translations[slug]?.title || slug;
}

export function getCategoryDescription(slug: string, lang: string = 'en'): string {
  const translations = importedCategoryTranslations(lang);
  return translations[slug]?.description || `Free online ${slug} tools`;
}

export async function getAllCategoriesWithTranslations(lang: string = 'en') {
  const config = importedCategoryConfig;
  const translations = importedCategoryTranslations(lang);
  const toolsByCategory = await getToolsGroupedByCategory(lang);
  
  return config.map(cat => ({
    ...cat,
    title: translations[cat.slug]?.title || cat.slug,
    description: translations[cat.slug]?.description || `Free online ${cat.slug} tools`,
    toolCount: toolsByCategory[cat.slug]?.length || cat.toolCount
  }));
}

export function getCategoryType(slug: string): string {
  const typeMap: Record<string, string> = {
    'calculators': 'calculators',
    'code-tools': 'code',
    'design-tools': 'design',
    'image-tools': 'image',
    'pdf-tools': 'pdf',
    'security-tools': 'security',
    'text-tools': 'text',
    'educational': 'educational'
  };
  return typeMap[slug] || 'educational';
}