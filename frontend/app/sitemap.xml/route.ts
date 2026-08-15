import { NextResponse } from 'next/server';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import { getLocalDB } from '@/lib/db/local-db';

const BASE_URL = 'https://www.centre.com.pk';
const LANGUAGES = ['en', 'ur', 'hi', 'ar'];

// ✅ FORCE STATIC + 24 HOUR CACHE
export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const db = getLocalDB();

  const staticPages = ['', 'about', 'contact', 'blog', 'search', 'tutorial', 'privacy-policy', 'terms', 'pricing', 'advertise'];
  const categories = ['calculators', 'code-tools', 'design-tools', 'image-tools', 'pdf-tools', 'security-tools', 'text-tools'];

  let blogPosts: any[] = [];
  try { 
    blogPosts = db.prepare("SELECT slug, lang FROM blog_posts WHERE status = 'published'").all() as any[]; 
  } catch {}

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Static pages
  for (const page of staticPages) {
    for (const lang of LANGUAGES) {
      const path = page ? `/${lang}/${page}` : `/${lang}`;
      xml += urlBlock(path, today, page === '' ? '1.0' : '0.6');
    }
  }

  // Categories
  for (const cat of categories) {
    for (const lang of LANGUAGES) {
      xml += urlBlock(`/${lang}/tools/${cat}`, today, '0.9');
    }
  }

  // Tools
  for (const tool of Object.values(TOOL_SEO_DATA) as any[]) {
    for (const lang of LANGUAGES) {
      xml += urlBlock(`/${lang}/tools/${tool.category}/${tool.slug}`, today, '0.8');
    }
  }

  // Blog posts
  for (const post of blogPosts) {
    xml += urlBlock(`/${post.lang}/blog/${post.slug}`, today, '0.7');
  }

  xml += '</urlset>';
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'CDN-Cache-Control': 'public, max-age=86400',
    },
  });
}

function urlBlock(path: string, lastmod: string, priority: string): string {
  const fullUrl = `${BASE_URL}${path}`;
  const lang = path.split('/')[1];
  let block = `  <url>\n    <loc>${escapeXml(fullUrl)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n`;
  
  for (const l of LANGUAGES) {
    const altPath = path.replace(`/${lang}/`, `/${l}/`);
    block += `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(BASE_URL + altPath)}"/>\n`;
  }
  block += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(BASE_URL + path.replace(`/${lang}/`, '/'))}"/>\n`;
  block += `  </url>\n`;
  return block;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}