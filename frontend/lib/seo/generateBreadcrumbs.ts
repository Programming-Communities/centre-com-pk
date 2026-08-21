// lib/seo/generateBreadcrumbs.ts — FIXED v2.0
// ✅ FIXED: Added lang parameter to all functions
// URLs now include /{lang} prefix to avoid redirects

import { SITE_URL } from './constants';
import { BreadcrumbItem } from './types';
import { CATEGORY_NAMES } from './constants';
import { TOOL_SEO_DATA } from './toolSeoData';

export function generateBreadcrumbs(
  toolSlug: string,
  category: string,
  lang: string = 'en'
): BreadcrumbItem[] {
  const toolData = TOOL_SEO_DATA[toolSlug];
  const categoryName = CATEGORY_NAMES[category] || category;
  
  return [
    { name: 'Home', url: `${SITE_URL}/${lang}` },
    { name: 'Tools', url: `${SITE_URL}/${lang}/tools` },
    { name: categoryName, url: `${SITE_URL}/${lang}/tools/${category}` },
    { name: toolData?.title || toolSlug.replace(/-/g, ' '), url: `${SITE_URL}/${lang}/tools/${category}/${toolSlug}` },
  ];
}

export function generateBreadcrumbsJsonLd(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: {
        '@id': item.url.startsWith('http') ? item.url : `https://www.centre.com.pk${item.url.startsWith('/') ? item.url : '/' + item.url}`,
        name: item.name,
      },
    })),
  };
}

export function generateCategoryBreadcrumbs(category: string, lang: string = 'en'): BreadcrumbItem[] {
  const categoryName = CATEGORY_NAMES[category] || category;
  
  return [
    { name: 'Home', url: `${SITE_URL}/${lang}` },
    { name: 'Tools', url: `${SITE_URL}/${lang}/tools` },
    { name: categoryName, url: `${SITE_URL}/${lang}/tools/${category}` },
  ];
}

export function generateToolsBreadcrumbs(lang: string = 'en'): BreadcrumbItem[] {
  return [
    { name: 'Home', url: `${SITE_URL}/${lang}` },
    { name: 'Tools', url: `${SITE_URL}/${lang}/tools` },
  ];
}