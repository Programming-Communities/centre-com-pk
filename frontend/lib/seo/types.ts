// lib/seo/types.ts — FIXED v2.0
// ✅ FIXED: Added bestRating and worstRating to aggregateRating

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolSEOData {
  updatedAt?: string;
  title: string;
  description: string;
  keywords: string[];
  faqs: FAQ[];
  relatedTools: string[];
  schemaType: 'SoftwareApplication' | 'WebApplication' | 'Tool';
  category: string;
  slug: string;
  lastModified?: string;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  featured?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changefreq: string;
  priority: number;
}

export interface SchemaData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
  author?: {
    '@type': string;
    name: string;
    url: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    ratingCount: string;
    bestRating?: string;   // ✅ FIXED: Added for Google validation
    worstRating?: string;  // ✅ FIXED: Added for Google validation
  };
}

export interface InternalLink {
  title: string;
  url: string;
  description: string;
  category: string;
}