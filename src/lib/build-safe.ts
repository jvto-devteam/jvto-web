// Build-time safety wrapper for Prisma queries.
//
// generateStaticParams + sitemap.data helpers run at build time (Vercel build,
// `next build`). When DATABASE_URL is unreachable from the build environment,
// every Prisma call throws and aborts the entire build.
//
// safeBuildQuery() short-circuits when DATABASE_URL is missing and catches any
// runtime Prisma error, returning a caller-supplied fallback so the build
// completes. Pages still render correctly at request time when the runtime
// environment has DATABASE_URL set.

export async function safeBuildQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
  label = "build-safe",
): Promise<T> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      `[${label}] DATABASE_URL not set at build, returning fallback`,
    );
    return fallback;
  }
  try {
    return await fn();
  } catch (e) {
    console.warn(
      `[${label}] Prisma query failed at build, returning fallback:`,
      (e as Error)?.message ?? e,
    );
    return fallback;
  }
}
