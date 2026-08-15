// C:\Users\AamirAli\Desktop\Final-centers\lib\seo\url-canonicalizer.ts
// 🔧 FIXED: Multi-language canonical URL strategy

export interface CanonicalUrlOptions {
  removeTrackingParams?: boolean;
  removeUIParams?: boolean;
  forceHttps?: boolean;
  removeTrailingSlash?: boolean;
  removeHash?: boolean;
  baseDomain?: string;
  /** ✅ NEW: For multi-language sites - always point to English */
  canonicalLanguage?: 'en' | 'original' | 'none';
}

export class URLCanonicalizer {
  private defaultOptions: CanonicalUrlOptions = {
    removeTrackingParams: true,
    removeUIParams: true,
    forceHttps: true,
    removeTrailingSlash: true,
    removeHash: true,
    baseDomain: 'https://www.centre.com.pk', // ✅ FIXED: Added www
    canonicalLanguage: 'original' 
  };

  // Tracking parameters to remove
  private trackingParams = new Set([
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'msclkid', 'twclid',
    'ref', 'source', 'medium', 'campaign',
    'mc_eid', 'mc_cid',
    '_cache', '_timestamp', '_r', '_t'
  ]);

  // UI parameters to optionally remove
  private uiParams = new Set([
    'theme', 'mode', 'view', 'layout',
    'color', 'font', 'size', 'zoom',
    'preview', 'test', 'debug'
  ]);

  // SEO-safe parameters to always keep
  private seoSafeParams = new Set([
    'page', 'category', 'tag', 'id', 'slug', 'post', 'tool',
    'q', 'search', 'query', 's',
    'filter', 'sort', 'order', 'type',
    'lang', 'locale', 'region', 'country'
  ]);

  constructor(options?: Partial<CanonicalUrlOptions>) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Canonicalize a URL string
   * ✅ FIXED: For multi-language, ALWAYS point non-English to English
   */
  canonicalize(url: string | URL, options?: Partial<CanonicalUrlOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const urlObj = typeof url === 'string' ? new URL(url, opts.baseDomain) : url;
    
    // Force HTTPS if enabled
    if (opts.forceHttps && urlObj.protocol === 'http:') {
      urlObj.protocol = 'https:';
    }
    
    // ✅ FIXED: Handle multi-language canonicalization
    if (opts.canonicalLanguage === 'en') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Check if first part is a language code
      const langPattern = /^(en|ur|es|fr|de|hi|bn|pt|ru|ja|ko|ar|tr|vi|th|id|fil|fa|ro|hu|cs|el|he|pl|uk|nl|sv|da|fi|no|sk|cro|sr|bg|lt|lv|et|sl|mt|ga|is|lu|mk|sq|hy|ka|uz|az|af|sw|cy|be|tg|tk|la|eo)$/;
      
      if (pathParts.length > 0 && langPattern.test(pathParts[0]) && pathParts[0] !== 'en') {
        // Replace language code with 'en'
        pathParts[0] = 'en';
        urlObj.pathname = '/' + pathParts.join('/');
      }
    }
    
    // Remove hash if enabled
    if (opts.removeHash) {
      urlObj.hash = '';
    }
    
    // Remove trailing slash if enabled (except root)
    if (opts.removeTrailingSlash && urlObj.pathname.endsWith('/') && urlObj.pathname !== '/') {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    // Fix common issues
    urlObj.pathname = this.fixCommonIssues(urlObj.pathname);
    
    // Process query parameters
    const params = new URLSearchParams(urlObj.search);
    const cleanParams = new URLSearchParams();
    
    for (const [key, value] of params) {
      const cleanKey = key.trim();
      const cleanValue = value.trim();
      
      // Skip empty values
      if (!cleanValue) continue;
      
      // Check if parameter should be kept
      if (this.shouldKeepParam(cleanKey, opts)) {
        cleanParams.append(cleanKey, cleanValue);
      }
    }
    
    // Sort params for consistency
    cleanParams.sort();
    urlObj.search = cleanParams.toString();
    
    return urlObj.toString();
  }

  /**
   * Get alternate URL for hreflang
   * ✅ NEW: For language alternates - preserve original language
   */
  getAlternateUrl(url: string | URL, lang: string): string {
    const opts = { ...this.defaultOptions, canonicalLanguage: 'none' };
    const urlObj = typeof url === 'string' ? new URL(url, opts.baseDomain) : new URL(url);
    
    // Replace language in path
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      pathParts[0] = lang;
      urlObj.pathname = '/' + pathParts.join('/');
    }
    
    return this.canonicalize(urlObj, { ...opts, canonicalLanguage: 'none' });
  }

  /**
   * Check if a URL is canonical
   */
  isCanonical(url: string | URL, options?: Partial<CanonicalUrlOptions>): boolean {
    const opts = { ...this.defaultOptions, ...options };
    const urlObj = typeof url === 'string' ? new URL(url, opts.baseDomain) : url;
    const canonicalUrl = this.canonicalize(urlObj, opts);
    
    return urlObj.toString() === canonicalUrl;
  }

  /**
   * Get canonical link header
   */
  getCanonicalLinkHeader(url: string | URL, options?: Partial<CanonicalUrlOptions>): string {
    const canonicalUrl = this.canonicalize(url, options);
    return `<${canonicalUrl}>; rel="canonical"`;
  }

  /**
   * Fix common URL issues
   */
  private fixCommonIssues(pathname: string): string {
    let fixed = pathname;
    
    // Fix duplicate segments
    fixed = fixed.replace(/\/tools\/tools\//g, '/tools/');
    fixed = fixed.replace(/\/blog\/blog\//g, '/blog/');
    fixed = fixed.replace(/\/categories\/categories\//g, '/categories/');
    
    // Fix multiple slashes
    fixed = fixed.replace(/([^:])\/\/+/g, '$1/');
    
    // Convert to lowercase
    fixed = fixed.toLowerCase();
    
    return fixed;
  }

  /**
   * Extract SEO-friendly parameters for sitemap
   */
  extractSeoParams(url: string | URL): Record<string, string> {
    const opts = { ...this.defaultOptions };
    const urlObj = typeof url === 'string' ? new URL(url, opts.baseDomain) : url;
    const params: Record<string, string> = {};
    
    for (const [key, value] of urlObj.searchParams) {
      if (this.seoSafeParams.has(key)) {
        params[key] = value;
      }
    }
    
    return params;
  }

  private shouldKeepParam(param: string, options: CanonicalUrlOptions): boolean {
    // Always keep SEO-safe parameters
    if (this.seoSafeParams.has(param)) {
      return true;
    }
    
    // Remove tracking parameters if enabled
    if (options.removeTrackingParams && this.trackingParams.has(param)) {
      return false;
    }
    
    // Remove UI parameters if enabled
    if (options.removeUIParams && this.uiParams.has(param)) {
      return false;
    }
    
    // Keep numeric parameters (likely IDs/pagination)
    if (/^\d+$/.test(param) || /^page\d*$/.test(param)) {
      return true;
    }
    
    // Default: keep unknown parameters (might be important)
    return true;
  }
}

// Singleton instance for easy use
export const urlCanonicalizer = new URLCanonicalizer();

// Helper functions
export function getCanonicalUrl(url: string): string {
  return urlCanonicalizer.canonicalize(url);
}

export function getAlternateUrl(url: string, lang: string): string {
  return urlCanonicalizer.getAlternateUrl(url, lang);
}

export function isCanonicalUrl(url: string): boolean {
  return urlCanonicalizer.isCanonical(url);
}

export function getCanonicalHeader(url: string): string {
  return urlCanonicalizer.getCanonicalLinkHeader(url);
}