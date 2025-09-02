import { Pool, QueryResultRow } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
});

export async function db<T extends QueryResultRow = any>(
  q: string,
  p?: any[]
): Promise<T[]> {
  const r = await pool.query<T>(q, p);
  return r.rows;
}

