// Dynamic Sitemap Generator

export function generateSitemapXML(
  entries: { url: string; changefreq: string; priority: number; lastmod: string }[]
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXML(entry.url)}</loc>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateRobotsTxt(
  siteUrl: string,
  sitemapUrl: string
): string {
  return `# robots.txt — Centre.com.pk
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: ${sitemapUrl}
Host: ${siteUrl}
`;
}

export function calculatePriority(url: string): number {
  if (url === '/') return 1.0;
  if (url.includes('/tools/calculators/') || url.includes('/tools/text-tools/')) return 0.9;
  if (url.includes('/tools/')) return 0.8;
  if (url.includes('/blog/')) return 0.7;
  if (url.includes('/about') || url.includes('/contact')) return 0.5;
  if (url.includes('/privacy') || url.includes('/terms')) return 0.3;
  return 0.5;
}

export function calculateChangefreq(url: string): string {
  if (url === '/') return 'daily';
  if (url.includes('/blog/')) return 'weekly';
  if (url.includes('/tools/')) return 'monthly';
  if (url.includes('/about') || url.includes('/privacy')) return 'yearly';
  return 'weekly';
}
