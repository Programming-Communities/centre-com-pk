// lib/seo/googlePinger.ts
import { SITE_URL } from './constants';

interface PingResult {
  success: boolean;
  message: string;
  status?: number;
  sitemapUrl: string;
}

export async function pingGoogle(
  sitemapUrl: string = `${SITE_URL}/sitemap.xml`,
  isSitemap: boolean = true
): Promise<PingResult> {
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CentersPKBot/1.0; +https://www.centre.com.pk/bot)',
      },
    });
    
    if (response.ok) {
      const message = `✅ Google ping successful for: ${sitemapUrl}`;
      console.log(message);
      return {
        success: true,
        message,
        status: response.status,
        sitemapUrl
      };
    } else {
      const message = `❌ Google ping failed with status: ${response.status}`;
      console.error(message);
      return {
        success: false,
        message,
        status: response.status,
        sitemapUrl
      };
    }
  } catch (error) {
    const message = `❌ Error pinging Google: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(message);
    return {
      success: false,
      message,
      sitemapUrl
    };
  }
}

export async function pingBing(sitemapUrl: string = `${SITE_URL}/sitemap.xml`): Promise<PingResult> {
  try {
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CentersPKBot/1.0; +https://www.centre.com.pk/bot)',
      },
    });
    
    if (response.ok) {
      const message = `✅ Bing ping successful for: ${sitemapUrl}`;
      console.log(message);
      return {
        success: true,
        message,
        status: response.status,
        sitemapUrl
      };
    } else {
      const message = `❌ Bing ping failed with status: ${response.status}`;
      console.error(message);
      return {
        success: false,
        message,
        status: response.status,
        sitemapUrl
      };
    }
  } catch (error) {
    const message = `❌ Error pinging Bing: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(message);
    return {
      success: false,
      message,
      sitemapUrl
    };
  }
}

export async function pingAllSearchEngines(): Promise<{
  google: PingResult;
  bing: PingResult;
}> {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  
  const [googleResult, bingResult] = await Promise.allSettled([
    pingGoogle(sitemapUrl),
    pingBing(sitemapUrl),
  ]);
  
  return {
    google: googleResult.status === 'fulfilled' ? googleResult.value : {
      success: false,
      message: googleResult.reason?.message || 'Google ping failed',
      sitemapUrl
    },
    bing: bingResult.status === 'fulfilled' ? bingResult.value : {
      success: false,
      message: bingResult.reason?.message || 'Bing ping failed',
      sitemapUrl
    },
  };
}

export async function pingOnContentUpdate(contentType: 'tool' | 'category' | 'page', slug: string): Promise<void> {
  console.log(`🔄 Pinging search engines for updated content: ${contentType} - ${slug}`);
  
  // Wait a moment for the content to be available
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Ping search engines
  const results = await pingAllSearchEngines();
  
  // Log results
  if (results.google.success && results.bing.success) {
    console.log('✅ Successfully pinged all search engines');
  } else {
    console.log('⚠️ Some search engines failed to ping:', results);
  }
  
  // Optional: Send notification or log to database
  if (process.env.SEO_WEBHOOK_URL) {
    try {
      await fetch(process.env.SEO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'content_update',
          contentType,
          slug,
          timestamp: new Date().toISOString(),
          pingResults: results,
        }),
      });
    } catch (error) {
      console.error('Failed to send SEO webhook:', error);
    }
  }
}