import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ToolsModule } from './tools/tools.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AdsModule } from './ads/ads.module';
import { PaymentsModule } from './payments/payments.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, ToolsModule, BlogModule, AuthModule, AdminModule, AdsModule, PaymentsModule, UserModule],
})
export class AppModule {}
