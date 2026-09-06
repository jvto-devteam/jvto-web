/**
 * Canonical route-string form for the public route contract (T01, 2026-09-06).
 *
 * Two byte-equivalent private copies of this logic already exist —
 * ecosystemContent/staticPageAdapter.ts:39 and ecosystemContent/website.ts:128.
 * Neither is exported. Importing one would make src/lib/routes depend on the
 * reader layer, which inverts the intended direction; de-duplicating them is a
 * follow-up, deliberately out of T01's foundation-only scope.
 */
export function normalizeRoute(route: string): string {
  const trimmed = route.trim();
  if (trimmed === "" || trimmed === "/") return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailing = withLeading.replace(/\/+$/, "");
  return (withoutTrailing === "" ? "/" : withoutTrailing).toLowerCase();
}
