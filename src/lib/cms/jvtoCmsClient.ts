// src/lib/cms/jvtoCmsClient.ts
// Lightweight pooled `pg` client for the jvto_cms content DB — the single editable
// content master (Model A). Used ONLY by the (cms) admin runtime + the write APIs,
// NEVER by the public (website) SSG render (which reads the committed seed, no DB).
//
// Gated on JVTO_CMS_DATABASE_URL: when unset (e.g. the Vercel SSG build, CI), the
// console write path falls back to its legacy behavior and nothing here connects —
// so the DB-free build guarantee is preserved.
import { Pool } from "pg";

let pool: Pool | null = null;

/** True when a jvto_cms connection is configured for this runtime. */
export function jvtoCmsEnabled(): boolean {
  return Boolean(process.env.JVTO_CMS_DATABASE_URL);
}

/** Shared pool (lazily created). Throws if JVTO_CMS_DATABASE_URL is absent. */
export function jvtoCmsPool(): Pool {
  if (!process.env.JVTO_CMS_DATABASE_URL) {
    throw new Error(
      "jvtoCmsPool: JVTO_CMS_DATABASE_URL is not set (jvto_cms is the CMS edit master; the console must run where it is reachable).",
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.JVTO_CMS_DATABASE_URL,
      max: Number(process.env.JVTO_CMS_POOL_MAX ?? 4),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return pool;
}

/** Convenience query helper. */
export async function jvtoCmsQuery<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await jvtoCmsPool().query(text, params);
  return res.rows as T[];
}
