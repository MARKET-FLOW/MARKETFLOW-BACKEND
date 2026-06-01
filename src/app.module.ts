import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { CashSessionsModule } from './cash-sessions/cash-sessions.module';
import { CategoriesModule } from './categories/categories.module';
import { MobileDevicesModule } from './mobile-devices/mobile-devices.module';
import { ProductsModule } from './products/products.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { SaleItemsModule } from './sale-items/sale-items.module';
import { SalesModule } from './sales/sales.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { StoresModule } from './stores/stores.module';
import { SyncQueuesModule } from './sync-queues/sync-queues.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (): Promise<CacheModuleOptions> => {
        try {
          if (process.env.REDIS_URL) {
            return {
              store: await redisStore({
                url: process.env.REDIS_URL,
                ttl: 600,
              }),
            };
          }
        } catch (error) {
          Logger.warn('Redis not available, using in-memory cache');
          console.log(
            `Exception while doing something: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
        return { ttl: 600 };
      },
    }),

    PrismaModule,
    UsersModule,
    AuditLogsModule,
    CashSessionsModule,
    CategoriesModule,
    MobileDevicesModule,
    ProductsModule,
    RefreshTokensModule,
    SaleItemsModule,
    SalesModule,
    StockMovementsModule,
    StoresModule,
    SyncQueuesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
