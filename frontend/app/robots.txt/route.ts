import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const robots = `# https://www.centre.com.pk/robots.txt
User-agent: *
Allow: /

User-agent: Yeti
Allow: /

Sitemap: https://www.centre.com.pk/sitemap.xml

Host: https://www.centre.com.pk
`;
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'CDN-Cache-Control': 'public, max-age=86400',
    },
  });
}