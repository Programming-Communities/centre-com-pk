import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis | null = null;

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
    });

    this.redis.on('connect', () => console.log('✅ Redis connected'));
    this.redis.on('error', (err) => console.error('❌ Redis error:', err.message));
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.redis) return null;
      return await this.redis.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    try {
      if (!this.redis) return;
      await this.redis.setex(key, ttlSeconds, value);
    } catch {}
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.redis) return;
      await this.redis.del(key);
    } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!this.redis) return;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
    } catch {}
  }

  onModuleDestroy() {
    if (this.redis) this.redis.quit();
  }
}