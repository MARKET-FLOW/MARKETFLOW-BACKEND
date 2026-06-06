import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Service Prisma global.
 *
 * Le middleware updated_at via $extends garantit que updatedAt est toujours
 * positionné côté applicatif, en complément des triggers PostgreSQL.
 * Cela couvre les mocks de tests unitaires où les triggers sont absents.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Retourne une instance Prisma étendue avec le middleware updated_at.
   * Utiliser cette méthode dans les services qui ont besoin du middleware.
   *
   * Exemple :
   *   const prisma = this.prismaService.withUpdatedAt();
   *   await prisma.product.update({ ... });
   */
  withUpdatedAt() {
    return this.$extends({
      query: {
        $allModels: {
          async update({ args, query }) {
            if (args.data !== undefined) {
              (args.data as Record<string, unknown>).updatedAt = new Date();
            }
            return query(args);
          },
          async updateMany({ args, query }) {
            if (args.data !== undefined) {
              (args.data as Record<string, unknown>).updatedAt = new Date();
            }
            return query(args);
          },
          async upsert({ args, query }) {
            const now = new Date();
            if (args.update !== undefined) {
              (args.update as Record<string, unknown>).updatedAt = now;
            }
            if (args.create !== undefined) {
              (args.create as Record<string, unknown>).updatedAt = now;
            }
            return query(args);
          },
        },
      },
    });
  }
}
