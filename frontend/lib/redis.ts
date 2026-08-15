// ⚡ HYBRID CACHE — Redis + Memory Fallback

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const CACHE_PREFIX = 'centers:';

// In-memory fallback (if Redis is down)
const memoryCache = new Map<string, { data: any; expiry: number }>();

// Clean expired memory cache every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryCache.entries()) {
    if (value.expiry < now) memoryCache.delete(key);
  }
}, 300000);

async function getRedisClient() {
  try {
    // Dynamic import — won't crash if Redis is down
    const { Redis } = await import('ioredis');
    return new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
    });
  } catch {
    return null;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const cacheKey = CACHE_PREFIX + key;
  
  // 1. Try Redis
  try {
    const redis = await getRedisClient();
    if (redis) {
      await redis.connect();
      const cached = await redis.get(cacheKey);
      await redis.quit();
      if (cached) {
        console.log(`⚡ Redis HIT: ${key}`);
        return JSON.parse(cached);
      }
    }
  } catch {
    // Redis failed — try memory cache
  }
  
  // 2. Try Memory Cache (fallback)
  const memCached = memoryCache.get(cacheKey);
  if (memCached && memCached.expiry > Date.now()) {
    console.log(`💾 Memory HIT: ${key}`);
    return memCached.data;
  }
  
  console.log(`❌ Cache MISS: ${key}`);
  return null;
}

export async function setCache(key: string, data: any, ttlSeconds: number = 3600): Promise<void> {
  const cacheKey = CACHE_PREFIX + key;
  const serialized = JSON.stringify(data);
  
  // 1. Save to Redis
  try {
    const redis = await getRedisClient();
    if (redis) {
      await redis.connect();
      await redis.setex(cacheKey, ttlSeconds, serialized);
      await redis.quit();
      console.log(`✅ Redis SET: ${key} (TTL: ${ttlSeconds}s)`);
    }
  } catch {
    // Redis failed — use memory cache
  }
  
  // 2. Save to Memory Cache (fallback)
  memoryCache.set(cacheKey, {
    data,
    expiry: Date.now() + (ttlSeconds * 1000),
  });
}

export async function clearCache(pattern: string): Promise<void> {
  const cacheKey = CACHE_PREFIX + pattern;
  
  // Clear Redis
  try {
    const redis = await getRedisClient();
    if (redis) {
      await redis.connect();
      const keys = await redis.keys(cacheKey + '*');
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`🗑️ Redis CLEAR: ${keys.length} keys`);
      }
      await redis.quit();
    }
  } catch {}
  
  // Clear Memory Cache
  for (const key of memoryCache.keys()) {
    if (key.includes(cacheKey)) {
      memoryCache.delete(key);
    }
  }
}
