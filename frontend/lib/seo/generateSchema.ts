// lib/seo/generateSchema.ts — FIXED v2.0
// ✅ FIXED: schemaType fallback, aggregateRating bestRating/worstRating
// ✅ TypeScript error fixed: types.ts now includes bestRating and worstRating

import { SchemaData } from './types';
import { SITE_URL, SITE_NAME } from './constants';
import { TOOL_SEO_DATA } from './toolSeoData';
import { generateBreadcrumbsJsonLd } from './generateBreadcrumbs';
import { generateFAQJsonLd } from './generateFAQs';

export function generateToolSchema(
  toolSlug: string,
  category: string,
  breadcrumbs: any[],
  lang: string = 'en'
): string {
  const toolData = TOOL_SEO_DATA[toolSlug];
  if (!toolData) return '';
  
  const toolUrl = `${SITE_URL}/${lang}/tools/${category}/${toolSlug}`;
  
  const toolSchema: SchemaData = {
    '@context': 'https://schema.org',
    '@type': toolData.schemaType || 'SoftwareApplication',
    name: toolData.title,
    description: toolData.description,
    url: toolUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
  };
  
  const breadcrumbSchema = generateBreadcrumbsJsonLd(breadcrumbs);
  const faqSchema = generateFAQJsonLd(toolData.faqs, toolData.title, toolUrl);
  
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q=`,
      'query-input': 'required name=q',
    },
  };
  
  const combinedSchema = [
    toolSchema,
    breadcrumbSchema,
    websiteSchema,
    ...(faqSchema ? [faqSchema] : []),
  ];
  
  return JSON.stringify(combinedSchema);
}

export function generateWebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Centre.com.pk Tools',
    url: SITE_URL,
    description: 'Free online tools for developers, designers, students, and professionals',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q=`,
      'query-input': 'required name=q',
    },
    inLanguage: ['en', 'ur', 'hi', 'ar'],
  };
  
  return JSON.stringify(schema);
}

export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/centerspk',
      'https://facebook.com/centerspk',
      'https://linkedin.com/company/centerspk',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@centre.com.pk',
      availableLanguage: ['English', 'Urdu', 'Hindi', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
  };
  
  return JSON.stringify(schema);
}