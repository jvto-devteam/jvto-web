export function routeSlugToParam(
  slug: string | null | undefined,
  prefix: string,
): string | null {
  if (!slug) return null;

  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");

  const path = normalizedSlug.startsWith(normalizedPrefix)
    ? normalizedSlug.slice(normalizedPrefix.length).replace(/^\/+/, "")
    : normalizedSlug;

  if (!path) return null;

  if (path.includes("/")) return null;

  return path;
}
