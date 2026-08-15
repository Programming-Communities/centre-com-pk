// components/seo/index.ts - FIXED VERSION
// Export all SEO components
export { default as MetaTags } from './MetaTags';
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as FAQs } from './FAQs';
export { default as InternalLinks } from './InternalLinks';
export { default as SchemaScript } from './SchemaScript';
export { default as RankingFactors } from './RankingFactors';
export { default as ShareButtons } from './ShareButtons';
export { default as ToolSEO } from './ToolSEO';

export { default as PerformanceScripts } from './PerformanceScripts';

// Export schema functions from SchemaScript.tsx
export { 
  WebsiteSchema, 
  OrganizationSchema, 
  LocalBusinessSchema, 
  SoftwareApplicationSchema 
} from './SchemaScript';

// Export WordPress SEO components (placeholder)
// Add WordPress components here when ready

// Export all types with proper imports
export type { 
  MetaTagsProps,
  BreadcrumbsProps,
  FAQsProps,
  InternalLinksProps,
  SchemaScriptProps,
  RankingFactorsProps,
  ShareButtonsProps,
  ToolSEOProps,
  PerformanceScriptsProps,
  FAQ,
  BreadcrumbItem,
  InternalLink,
  ToolSEOData
} from './types';