// components/seo/types.ts - PROFESSIONAL COMPLETE VERSION
import type { 
  FAQ as LibFAQ, 
  BreadcrumbItem as LibBreadcrumbItem, 
  InternalLink as LibInternalLink, 
  ToolSEOData as LibToolSEOData 
} from '@/lib/seo/types';

// Re-export lib types with original names
export type FAQ = LibFAQ;
export type BreadcrumbItem = LibBreadcrumbItem;
export type InternalLink = LibInternalLink;
export type ToolSEOData = LibToolSEOData;

// Component-specific types
export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'tool';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  toolName?: string;
  toolCategory?: string;
  isToolPage?: boolean;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  separator?: React.ReactNode;
}

export interface FAQsProps {
  faqs?: FAQ[];
  title?: string;
  className?: string;
  defaultOpen?: number;
  showSchema?: boolean;
}

export interface InternalLinksProps {
  links?: InternalLink[];
  title?: string;
  description?: string;
  maxLinks?: number;
  showCategory?: boolean;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export interface SchemaScriptProps {
  schema?: Record<string, any>;
  type?: 'application/ld+json' | 'application/json';
  className?: string;
}

export interface RankingFactorsProps {
  pageUrl?: string;
  trackEngagement?: boolean;
  trackScroll?: boolean;
  trackClicks?: boolean;
  trackTime?: boolean;
}

export interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  customTheme?: string;
}

export interface PerformanceScriptsProps {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
}

export interface ToolSEOProps {
  toolData: ToolSEOData;
  theme?: string;
  showMetaTags?: boolean;
  showBreadcrumbs?: boolean;
  showFAQs?: boolean;
  showInternalLinks?: boolean;
  showSchema?: boolean;
  showRankingFactors?: boolean;
}