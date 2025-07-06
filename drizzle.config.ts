import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set in .env file');
}

export default {
  schema: './lib/db.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config; 