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

// ── Build-time placeholder mode ─────────────────────────────────────────────
// When DATABASE_URL is the agreed placeholder (used to satisfy `prisma generate`
// and PrismaClient init during CI/Vercel builds without DB access), every query
// must short-circuit. Connecting to localhost:5432/placeholder would block the
// build with PrismaClientInitializationError. The proxy below returns shape-
// compatible empty results (null for single records, [] for lists, 0 for count)
// so server components render their empty/fallback states. Runtime deploys
// with a real DATABASE_URL bypass this path entirely.
const dbUrl = process.env.DATABASE_URL ?? "";
const isBuildPlaceholder =
  dbUrl.includes("placeholder:placeholder@localhost") ||
  dbUrl.includes("/placeholder?schema=public");

function makeBuildSafePrismaStub(): PrismaClient {
  const arrayMethods = new Set([
    "findMany",
    "$queryRaw",
    "$queryRawUnsafe",
    "$executeRaw",
    "$executeRawUnsafe",
  ]);
  const countMethods = new Set(["count"]);

  const modelProxy = new Proxy(
    {},
    {
      get(_t, method: string) {
        return async (..._args: unknown[]) => {
          if (arrayMethods.has(method)) return [];
          if (countMethods.has(method)) return 0;
          return null;
        };
      },
    },
  );

  const rootProxy = new Proxy(
    {},
    {
      get(_t, prop: string) {
        if (prop === "$connect" || prop === "$disconnect")
          return async () => undefined;
        if (prop === "$transaction")
          return async (arg: unknown) => {
            if (typeof arg === "function") {
              return (arg as (tx: unknown) => unknown)(rootProxy);
            }
            return Array.isArray(arg) ? [] : null;
          };
        if (prop === "$on") return () => undefined;
        if (prop === "$use") return () => undefined;
        if (prop === "$extends") return () => rootProxy;
        if (prop === "$queryRaw" || prop === "$queryRawUnsafe") return async () => [];
        if (prop === "$executeRaw" || prop === "$executeRawUnsafe") return async () => 0;
        return modelProxy;
      },
    },
  );

  if (typeof console !== "undefined") {
    console.warn(
      "[prisma] DATABASE_URL is a placeholder — using build-safe stub that returns null/[]/0 for every query. Set a real DATABASE_URL at runtime to enable queries.",
    );
  }

  return rootProxy as unknown as PrismaClient;
}

export const prisma =
  globalForPrisma.prisma ??
  (isBuildPlaceholder
    ? makeBuildSafePrismaStub()
    : new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      }));

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export default juga untuk compatibility
export default prisma;