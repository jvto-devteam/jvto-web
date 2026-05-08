const globalForPublicContent = globalThis as unknown as {
  __jvtoPublicContentWarnings?: Set<string>;
};

function getWarningSet(): Set<string> {
  if (!globalForPublicContent.__jvtoPublicContentWarnings) {
    globalForPublicContent.__jvtoPublicContentWarnings = new Set<string>();
  }

  return globalForPublicContent.__jvtoPublicContentWarnings;
}

export function logPublicContentOnce(
  key: string,
  level: "warn" | "error",
  message: string,
) {
  const seen = getWarningSet();
  if (seen.has(key)) return;

  seen.add(key);
  console[level](message);
}

export function canUseDatabaseFallback(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.PUBLIC_CONTENT_ALLOW_DB_FALLBACK === "true") return true;

  return process.env.CI !== "true";
}

export function canUsePublishedSnapshotDatabaseFallback(
  envFlag = "PUBLIC_CONTENT_ALLOW_PUBLISHED_SNAPSHOT_DB_FALLBACK",
): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  return process.env[envFlag] === "true";
}

export function normalizeRouteSlug(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

export function parseOptionalDate(value?: string): Date | undefined {
  if (!value) return undefined;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
