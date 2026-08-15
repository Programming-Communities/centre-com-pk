// lib/seo/index.ts
// Export all SEO utilities and functions
export * from './types';
export * from './constants';
export * from './utils';
export * from './toolSeoData';
export * from './generateMetadata';
export * from './generateBreadcrumbs';
export * from './generateFAQs';
export * from './generateSchema';
export * from './sitemapGenerator';
export * from './googlePinger';
export * from './internalLinker';
export * from './rankingOptimizer';

// Main SEO generator function
export async function generateCompleteSEO(toolSlug: string, category: string) {
  const { getToolSEOData } = await import('./toolSeoData');
  const { generateToolMetadata } = await import('./generateMetadata');
  const { generateBreadcrumbs } = await import('./generateBreadcrumbs');
  const { getToolFAQs, generateFAQSchema } = await import('./generateFAQs');
  const { generateToolSchema } = await import('./generateSchema');
  const { getRelatedTools } = await import('./internalLinker');
  const { analyzeToolSEO } = await import('./rankingOptimizer');

  const toolData = getToolSEOData(toolSlug);
  const breadcrumbs = generateBreadcrumbs(toolSlug, category);
  const faqs = getToolFAQs(toolSlug);
  const relatedTools = getRelatedTools(toolSlug);
  const seoMetrics = analyzeToolSEO(toolSlug);

  return {
    metadata: generateToolMetadata(toolData),
    breadcrumbs,
    faqs,
    faqSchema: generateFAQSchema(faqs, toolSlug, category),
    mainSchema: generateToolSchema(toolSlug, category, breadcrumbs),
    relatedTools,
    seoMetrics,
    toolData,
  };
}