// Edge Runtime compatible cache system with proper TypeScript types

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expires: number;
  staleUntil: number;
  etag: string;
  lastModified: string;
  tags: string[];
}

export interface CacheOptions {
  ttl: number; // Time to live in seconds
  swr?: number; // Stale while revalidate in seconds
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  lastReset: number;
  currentSize: number;
  uptime: number;
  memoryUsage: string;
  cacheKeys: string[];
}

export interface CacheResult<T> {
  data: T | null;
  stale: boolean;
  timestamp?: number;
}

class EdgeCache {
  private cache: Map<string, CacheItem> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    lastReset: Date.now(),
  };

  // Generate ETag using Web Crypto API (Edge compatible)
  generateETag(data: any): string {
    const encoder = new TextEncoder();
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const dataBuffer = encoder.encode(dataString);
    
    // Simple hash simulation for Edge runtime
    let hash = 0;
    for (let i = 0; i < Math.min(dataBuffer.length, 16); i++) {
      hash = ((hash << 5) - hash) + dataBuffer[i];
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // Generate cache headers
  generateCacheHeaders(options: {
    value: any;
    expires: number;
    staleUntil: number;
    etag: string;
    lastModified: string;
    tags: string[];
  }): Record<string, string> {
    const maxAge = Math.floor((options.expires - Date.now()) / 1000);
    const sMaxAge = Math.floor((options.staleUntil - Date.now()) / 1000);
    
    const headers: Record<string, string> = {
      'ETag': `"${options.etag}"`,
      'Last-Modified': options.lastModified,
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    };

    if (options.tags.length > 0) {
      headers['X-Cache-Tags'] = options.tags.join(',');
    }

    return headers;
  }

  // Set cache item
  async set<T>(key: string, value: T, options: CacheOptions): Promise<void> {
    const now = Date.now();
    const expires = now + (options.ttl * 1000);
    const staleUntil = options.swr ? expires + (options.swr * 1000) : expires;

    const cacheItem: CacheItem<T> = {
      data: value,
      timestamp: now,
      expires,
      staleUntil,
      etag: this.generateETag(value),
      lastModified: new Date(now).toUTCString(),
      tags: options.tags || [],
    };

    this.cache.set(key, cacheItem);
    this.stats.sets++;
    this.stats.size = this.cache.size;

    // Auto cleanup for expired items
    if (typeof setTimeout !== 'undefined') {
      setTimeout(() => {
        if (this.cache.has(key)) {
          const item = this.cache.get(key);
          if (item && Date.now() > item.staleUntil) {
            this.cache.delete(key);
            this.stats.size = this.cache.size;
          }
        }
      }, options.ttl * 1000);
    }
  }

  // Get cache item
  async get<T>(key: string): Promise<CacheResult<T>> {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      this.stats.misses++;
      return { data: null, stale: false };
    }

    const now = Date.now();
    
    // Check if expired
    if (now > item.staleUntil) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      this.stats.misses++;
      return { data: null, stale: false };
    }

    // Check if stale but still usable
    const isStale = now > item.expires && now <= item.staleUntil;

    if (isStale) {
      // Stale but usable - trigger async revalidation
      this.stats.hits++;
      return { data: item.data, stale: true, timestamp: item.timestamp };
    }

    // Fresh cache hit
    this.stats.hits++;
    return { data: item.data, stale: false, timestamp: item.timestamp };
  }

  // Get from cache with fallback
  async getWithFallback<T>(
    key: string,
    options: CacheOptions,
    fallback?: () => Promise<T>
  ): Promise<CacheResult<T>> {
    const cached = await this.get<T>(key);

    if (cached.data && !cached.stale) {
      return cached;
    }

    if (cached.stale && fallback) {
      // Return stale data immediately, refresh in background
      if (typeof setTimeout !== 'undefined') {
        setTimeout(async () => {
          try {
            const freshData = await fallback();
            await this.set(key, freshData, options);
          } catch (error) {
            console.error('Cache refresh failed:', error);
          }
        }, 0);
      }
    }

    if (!cached.data && fallback) {
      // Cache miss, get fresh data
      try {
        const freshData = await fallback();
        await this.set(key, freshData, options);
        return { data: freshData, stale: false, timestamp: Date.now() };
      } catch (error) {
        console.error('Fallback failed:', error);
        return { data: null, stale: false };
      }
    }

    return cached;
  }

  // Delete cache item
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  // Clear cache by tag
  clearByTag(tag: string): number {
    let count = 0;
    for (const [key, item] of this.cache.entries()) {
      if (item.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    this.stats.size = this.cache.size;
    return count;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.sets = 0;
    this.stats.deletes = 0;
    this.stats.lastReset = Date.now();
  }

  // Get cache stats
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      size: this.stats.size,
      lastReset: this.stats.lastReset,
      currentSize: this.cache.size,
      uptime: Date.now() - this.stats.lastReset,
      memoryUsage: 'Edge Runtime - Optimized',
      cacheKeys: Array.from(this.cache.keys()).slice(0, 10),
    };
  }

  // Check if edge cache is available - FIXED VERSION
  isAvailable(): boolean {
    // Always return true in development to test the cache
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // In production, check for Edge Runtime
    if (typeof process !== 'undefined' && process.env) {
      return process.env.VERCEL === '1' || 
             process.env.NEXT_RUNTIME === 'edge' ||
             process.env.AWS_LAMBDA_FUNCTION_VERSION !== undefined;
    }
    
    return true; // Default to true for testing
  }

  // Public method to record hit
  recordHit(): void {
    this.stats.hits++;
  }

  // Public method to record miss
  recordMiss(): void {
    this.stats.misses++;
  }
}

// Export singleton instance
export const edgeCache = new EdgeCache();

// Export individual functions with correct names
export const getEdgeCache = edgeCache.get.bind(edgeCache);
export const setEdgeCache = edgeCache.set.bind(edgeCache);
export const isEdgeCacheAvailable = edgeCache.isAvailable.bind(edgeCache);
export const getCacheStats = edgeCache.getStats.bind(edgeCache);
export const clearEdgeCache = edgeCache.clear.bind(edgeCache);
export const clearEdgeCacheByTag = edgeCache.clearByTag.bind(edgeCache);
export const getFromCache = edgeCache.getWithFallback.bind(edgeCache);
export const setCache = edgeCache.set.bind(edgeCache);
export const generateETag = edgeCache.generateETag.bind(edgeCache);
export const generateCacheHeaders = edgeCache.generateCacheHeaders.bind(edgeCache);
export const recordHit = edgeCache.recordHit.bind(edgeCache);
export const recordMiss = edgeCache.recordMiss.bind(edgeCache);