// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

// ── BigInt JSON serialization fix (added 2026-04-29) ─────────────────────────
// Prisma returns BigInt for `BigInt` columns (e.g., `packages.id`, `bookings.id`).
// JSON.stringify throws "Do not know how to serialize a BigInt" when these leak into
// schema JSON-LD, generateMetadata, or any Server Component output. This monkey-patch
// makes BigInt serialize as its decimal string (idiomatic — same fix used by Vercel +
// most Prisma-on-Next codebases since BigInt landed). Idempotent: only patches if missing.
//
// This complements the existing `replaceBigInt` helper in /api/packages/web/details
// route.ts — that one walks/clones objects to strip BigInt; this prototype-level patch
// catches every leak path including ones that don't go through the API route (e.g., direct
// Prisma calls from Server Components like getAllNarrativeClaims, getPublishedPackageFaqsBySlug).
{
  // Type assertion: BigInt.prototype lacks toJSON in lib.es2020.bigint.d.ts.
  // `as unknown as` double cast required because TS won't narrow BigInt to a structural type directly.
  const proto = BigInt.prototype as unknown as { toJSON?: () => string };
  if (typeof proto.toJSON !== 'function') {
    proto.toJSON = function (this: bigint) {
      return this.toString();
    };
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export default juga untuk compatibility
export default prisma;