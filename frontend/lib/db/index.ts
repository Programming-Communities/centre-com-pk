import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:centers123@localhost:5432/centers';

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
export * from './schema';
