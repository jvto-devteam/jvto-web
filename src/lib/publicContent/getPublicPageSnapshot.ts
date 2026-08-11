import { getContentPage } from "@/lib/content/getContentPage";
import { publicPageSnapshots } from "./pageSnapshots";
import type {
  PublicPageResolution,
  PublicPageRow,
  PublicPageSnapshot,
} from "./types";

type ContentPageRow = Awaited<ReturnType<typeof getContentPage>>;

const globalForPublicContent = globalThis as unknown as {
  __jvtoPublicContentWarnings?: Set<string>;
};

function getWarningSet(): Set<string> {
  if (!globalForPublicContent.__jvtoPublicContentWarnings) {
    globalForPublicContent.__jvtoPublicContentWarnings = new Set<string>();
  }

  return globalForPublicContent.__jvtoPublicContentWarnings;
}

function logOnce(key: string, level: "warn" | "error", message: string) {
  const seen = getWarningSet();
  if (seen.has(key)) return;

  seen.add(key);
  console[level](message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asIsoString(value: Date | string | null | undefined): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim().length > 0) return value;
  return undefined;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toPageRow(snapshot: PublicPageSnapshot): PublicPageRow {
  return {
    route: snapshot.route,
    lang: snapshot.lang,
    seo: snapshot.seo,
    content: snapshot.content,
    created_at: parseDate(snapshot.meta.generatedAt),
    updated_at: parseDate(snapshot.meta.updatedAt ?? snapshot.meta.generatedAt),
  };
}

function toPageRowFromContentPageRow(
  route: string,
  row: NonNullable<ContentPageRow>,
): PublicPageRow {
  return {
    route: row.route || route,
    lang: row.lang || "en",
    seo: (isRecord(row.seo) ? row.seo : {}) as PublicPageRow["seo"],
    content: (isRecord(row.content) ? row.content : {}) as PublicPageRow["content"],
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? row.created_at ?? undefined,
  };
}

function toSnapshot(
  route: string,
  row: NonNullable<ContentPageRow>,
): PublicPageSnapshot | null {
  const seo = isRecord(row.seo) ? row.seo : {};
  const content = isRecord(row.content) ? row.content : {};

  const title =
    typeof seo.title === "string" && seo.title.trim().length > 0
      ? seo.title
      : null;

  if (!title) return null;

  return {
    route: row.route || route,
    lang: row.lang || "en",
    seo: {
      ...seo,
      title,
      description:
        typeof seo.description === "string" ? seo.description : undefined,
    },
    content: {
      ...content,
      h1: typeof content.h1 === "string" ? content.h1 : undefined,
    },
    meta: {
      generatedAt: asIsoString(row.created_at) ?? new Date().toISOString(),
      updatedAt: asIsoString(row.updated_at) ?? asIsoString(row.created_at),
      source: "content_pages",
    },
  };
}

function hasRequiredContentFields(
  snapshot: PublicPageSnapshot,
  requiredContentFields: string[],
): boolean {
  if (!requiredContentFields.length) return true;

  return requiredContentFields.every((field) => {
    const value = snapshot.content[field];

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return value !== undefined && value !== null;
  });
}

function buildInlineFallback(
  route: string,
  fallbackSnapshot?: PublicPageSnapshot,
): PublicPageSnapshot {
  if (fallbackSnapshot) return fallbackSnapshot;

  return {
    route,
    lang: "en",
    seo: {
      title: route,
      description: "",
    },
    content: {
      h1: route,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      source: "inline-fallback",
    },
  };
}

function allowDatabaseFallbackInCurrentEnv(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  if (process.env.PUBLIC_CONTENT_ALLOW_DB_FALLBACK === "true") return true;

  return process.env.CI !== "true";
}

export async function getPublicPageSnapshot(
  route: string,
  options?: {
    fallbackSnapshot?: PublicPageSnapshot;
    allowDatabaseFallback?: boolean;
    requiredContentFields?: string[];
  },
): Promise<PublicPageResolution> {
  const requiredContentFields = options?.requiredContentFields ?? [];
  const snapshot =
    publicPageSnapshots[route] ?? options?.fallbackSnapshot ?? null;

  if (snapshot && hasRequiredContentFields(snapshot, requiredContentFields)) {
    return {
      source: "snapshot",
      snapshot,
      pageRow: toPageRow(snapshot),
      usedDatabaseFallback: false,
    };
  }

  if (snapshot && requiredContentFields.length > 0) {
    logOnce(
      `incomplete-snapshot:${route}:${requiredContentFields.join(",")}`,
      "warn",
      `[publicContent] Snapshot for "${route}" is missing required content fields (${requiredContentFields.join(", ")}).`,
    );
  }

  const allowDatabaseFallback =
    options?.allowDatabaseFallback ?? allowDatabaseFallbackInCurrentEnv();

  if (!allowDatabaseFallback) {
    logOnce(
      `strict-missing-snapshot:${route}`,
      "error",
      `[publicContent] Missing page snapshot for "${route}" in strict production mode.`,
    );

    const inlineFallback = snapshot ?? buildInlineFallback(route, options?.fallbackSnapshot);
    return {
      source: snapshot ? "snapshot" : "inline-fallback",
      snapshot: inlineFallback,
      pageRow: toPageRow(inlineFallback),
      usedDatabaseFallback: false,
    };
  }

  const row = await getContentPage(route, "en");
  const databaseSnapshot = row ? toSnapshot(route, row) : null;

  if (databaseSnapshot) {
    logOnce(
      `database-fallback:${route}`,
      "warn",
      `[publicContent] Using content_pages fallback for "${route}". Add a public snapshot before production cutover.`,
    );

    return {
      source: "database-fallback",
      snapshot: databaseSnapshot,
      pageRow: toPageRowFromContentPageRow(route, row as NonNullable<ContentPageRow>),
      usedDatabaseFallback: true,
    };
  }

  logOnce(
    `missing-db-and-snapshot:${route}`,
    "error",
    `[publicContent] No page snapshot or content_pages row found for "${route}". Using inline fallback.`,
  );

  const inlineFallback = snapshot ?? buildInlineFallback(route, options?.fallbackSnapshot);
  return {
    source: snapshot ? "snapshot" : "inline-fallback",
    snapshot: inlineFallback,
    pageRow: toPageRow(inlineFallback),
    usedDatabaseFallback: false,
  };
}
