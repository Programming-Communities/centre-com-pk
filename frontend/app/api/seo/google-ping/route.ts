// app/api/seo/google-ping/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pingGoogle } from '@/lib/seo/googlePinger';

// ✅ CRITICAL: Edge Runtime required for Cloudflare

export async function POST(request: NextRequest) {
  try {
    const { url, sitemapUrl } = await request.json();

    if (!url && !sitemapUrl) {
      return NextResponse.json(
        { error: 'URL or sitemap URL is required' },
        { status: 400 }
      );
    }

    // ✅ FIX: Remove fs operations - use console for Edge
    const timestamp = new Date().toISOString();
    console.log('[SEO-Ping] Request:', {
      timestamp,
      url: url || 'N/A',
      sitemapUrl: sitemapUrl || 'N/A',
      method: 'POST'
    });

    let result;
    if (sitemapUrl) {
      result = await pingGoogle(sitemapUrl, true);
    } else {
      result = await pingGoogle(url, false);
    }

    // ✅ Log result to console (Cloudflare Workers logs)
    console.log('[SEO-Ping] Result:', {
      timestamp,
      success: result.success,
      message: result.message,
      status: result.status
    });

    return NextResponse.json({
      success: true,
      message: result.success ? 'Ping successful' : 'Ping failed',
      data: result
    });

  } catch (error) {
    console.error('[SEO-Ping] API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const sitemapUrl = request.nextUrl.searchParams.get('sitemapUrl');

    if (!url && !sitemapUrl) {
      return NextResponse.json(
        { error: 'URL or sitemap URL is required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    console.log('[SEO-Ping] GET Request:', {
      timestamp,
      url: url || 'N/A',
      sitemapUrl: sitemapUrl || 'N/A'
    });

    let result;
    const pingUrl = sitemapUrl || url!;
    if (sitemapUrl) {
      result = await pingGoogle(pingUrl, true);
    } else {
      result = await pingGoogle(pingUrl, false);
    }

    console.log('[SEO-Ping] GET Result:', {
      timestamp,
      success: result.success,
      message: result.message
    });

    return NextResponse.json({
      success: true,
      message: result.success ? 'Ping successful' : 'Ping failed',
      data: result
    });

  } catch (error) {
    console.error('[SEO-Ping] GET error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
