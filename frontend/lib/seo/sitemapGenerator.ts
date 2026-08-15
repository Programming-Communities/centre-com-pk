// lib/seo/sitemapGenerator.ts
import { SitemapEntry } from './types';
import { SITE_URL, DEFAULT_CHANGEFREQ, DEFAULT_PRIORITY, HOME_PRIORITY, CATEGORY_PRIORITY, TOOL_PRIORITY } from './constants';
import { TOOL_SEO_DATA, getAllToolSlugs, getAllCategories } from './toolSeoData';
import { formatDate } from './utils';

export async function generateSitemap(): Promise<string> {
  const entries: SitemapEntry[] = [];
  const today = new Date();
  
  // Homepage
  entries.push({
    url: SITE_URL,
    lastModified: today.toISOString(),
    changefreq: 'daily',
    priority: HOME_PRIORITY,
  });
  
  // Tools page
  entries.push({
    url: `${SITE_URL}/tools`,
    lastModified: today.toISOString(),
    changefreq: 'daily',
    priority: 0.9,
  });
  
  // Category pages
  const categories = getAllCategories();
  categories.forEach(category => {
    entries.push({
      url: `${SITE_URL}/tools/${category}`,
      lastModified: today.toISOString(),
      changefreq: 'weekly',
      priority: CATEGORY_PRIORITY,
    });
  });
  
  // Individual tool pages
  const toolSlugs = getAllToolSlugs();
  toolSlugs.forEach(slug => {
    const toolData = TOOL_SEO_DATA[slug];
    if (toolData) {
      entries.push({
        url: `${SITE_URL}/tools/${toolData.category}/${slug}`,
        lastModified: today.toISOString(),
        changefreq: toolData.changefreq || DEFAULT_CHANGEFREQ,
        priority: toolData.priority || TOOL_PRIORITY,
      });
    }
  });
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('')}
</urlset>`;
  
  return xml;
}

export function generateSitemapIndex(): string {
  const today = formatDate();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-tools.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const today = new Date();
  
  // Homepage
  entries.push({
    url: SITE_URL,
    lastModified: today.toISOString(),
    changefreq: 'daily',
    priority: HOME_PRIORITY,
  });
  
  // Tools page
  entries.push({
    url: `${SITE_URL}/tools`,
    lastModified: today.toISOString(),
    changefreq: 'daily',
    priority: 0.9,
  });
  
  // Category pages
  const categories = getAllCategories();
  categories.forEach(category => {
    entries.push({
      url: `${SITE_URL}/tools/${category}`,
      lastModified: today.toISOString(),
      changefreq: 'weekly',
      priority: CATEGORY_PRIORITY,
    });
  });
  
  // Individual tool pages
  const toolSlugs = getAllToolSlugs();
  toolSlugs.forEach(slug => {
    const toolData = TOOL_SEO_DATA[slug];
    if (toolData) {
      entries.push({
        url: `${SITE_URL}/tools/${toolData.category}/${slug}`,
        lastModified: today.toISOString(),
        changefreq: toolData.changefreq || DEFAULT_CHANGEFREQ,
        priority: toolData.priority || TOOL_PRIORITY,
      });
    }
  });
  
  return entries;
}

export function generateRobotsTxt(): string {
  return `# Robots.txt for ${SITE_URL}
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml

# Crawl delay (optional)
# Crawl-delay: 10

# Special rules for specific bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Googlebot
Allow: /
Disallow: /api/
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Disallow: /api/
Crawl-delay: 2

User-agent: Slurp
Allow: /
Disallow: /api/
Crawl-delay: 3

# Development/staging environments
User-agent: *
Disallow: /staging/
Disallow: /dev/
Disallow: /test/

# Ads.txt and other important files
Allow: /ads.txt
Allow: /security.txt
Allow: /humans.txt
Allow: /.well-known/
`;
}