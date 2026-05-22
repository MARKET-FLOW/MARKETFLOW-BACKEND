import { config } from 'dotenv';
import * as path from 'node:path';
import { defineConfig } from 'prisma/config';

config({ path: path.join(process.cwd(), '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
