// app/api/seo/update-sitemap/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateSitemap, generateRobotsTxt } from '@/lib/seo/sitemapGenerator';

// ✅ CRITICAL: Edge Runtime for Cloudflare

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Simple authentication check
    if (authHeader !== `Bearer ${process.env.SEO_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate sitemap XML
    const sitemapXml = await generateSitemap();
    const robotsTxt = generateRobotsTxt();
    
    const timestamp = new Date().toISOString();
    const urlCount = (sitemapXml.match(/<url>/g) || []).length;
    
    // ✅ Log to console (Cloudflare Workers logs)
    console.log('[Sitemap] GET - Generated:', {
      timestamp,
      action: 'sitemap_generation',
      sitemapUrlCount: urlCount,
      robotsTxtLength: robotsTxt.length
    });
    
    // ✅ Return XML directly (no file system)
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Generated-At': timestamp,
        'X-Url-Count': urlCount.toString(),
        'X-Robots-Txt-Length': robotsTxt.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('[Sitemap] GET error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader !== `Bearer ${process.env.SEO_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { trigger } = body;
    
    // Generate sitemap XML
    const sitemapXml = await generateSitemap();
    const robotsTxt = generateRobotsTxt();
    
    const timestamp = new Date().toISOString();
    const urlCount = (sitemapXml.match(/<url>/g) || []).length;
    
    // ✅ Log to console
    console.log('[Sitemap] POST - Generated:', {
      timestamp,
      action: 'sitemap_generation',
      trigger: trigger || 'manual_api_call',
      sitemapUrlCount: urlCount,
      robotsTxtLength: robotsTxt.length
    });
    
    // ✅ Return both sitemap and robots.txt as JSON
    return NextResponse.json({
      success: true,
      message: 'Sitemap generated successfully',
      data: {
        sitemapXml,
        robotsTxt,
        sitemapUrlCount: urlCount,
        timestamp,
        trigger: trigger || 'manual_api_call',
        generatedAt: timestamp
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Generated-At': timestamp,
      }
    });
    
  } catch (error) {
    console.error('[Sitemap] POST error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// ✅ OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
