import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { ToolsModule } from './tools/tools.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AdsModule } from './ads/ads.module';
import { PaymentsModule } from './payments/payments.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Rate Limiting — 100 requests per minute per IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    RedisModule,
    ToolsModule,
    BlogModule,
    AuthModule,
    AdminModule,
    AdsModule,
    PaymentsModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}