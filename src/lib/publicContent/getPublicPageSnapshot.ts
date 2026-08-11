import { getContentPage } from "@/lib/content/getContentPage";
import { SEED_COVERED_ROUTES } from "@/lib/cms/seedResolver";
import { loadStaticPage } from "@/lib/static-content";
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

    // An empty array is NOT complete content. Without this, an active CMS row
    // whose `sections: []` was published empty would count as "complete", get
    // preferred over a good static snapshot, then trip the page's own
    // empty-sections notFound() → a formerly static page 404s. Treating [] as
    // incomplete makes such a row fall back to the snapshot instead.
    if (Array.isArray(value)) {
      return value.length > 0;
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

  // Migrated-route guard (PACKAGE 05c): a route served by content/ NEVER reads
  // the DB and never uses legacy snapshots — its snapshot is synthesized from
  // the content file so legacy call sites (CMS console resolvePageContent,
  // sitemap lastmod) still see real title/description, marked
  // meta.source = "static-content". Without this, deleting a route's cms-seed
  // rows would silently re-open the runtime DB-override path below.
  const staticPage = loadStaticPage(route);
  const contentOwnsRoute =
    staticPage != null && staticPage.meta.status === "published";

  const snapshot: PublicPageSnapshot | null = contentOwnsRoute
    ? {
        route: staticPage.meta.route,
        lang: "en",
        seo: {
          title: staticPage.meta.browserTitle ?? staticPage.meta.title,
          description: staticPage.meta.description,
        },
        content: { h1: staticPage.meta.title },
        meta: {
          generatedAt: `${staticPage.meta.lastReviewed}T00:00:00.000Z`,
          source: "static-content",
        },
      }
    : (publicPageSnapshots[route] ?? options?.fallbackSnapshot ?? null);

  const snapshotIsComplete =
    !!snapshot && hasRequiredContentFields(snapshot, requiredContentFields);

  // Editorial content-plane swap (jvto_cms seed): for seed-covered routes the
  // seed snapshot is AUTHORITATIVE at both build AND runtime — force
  // allowDatabaseFallback=false so no jvto_dev content_pages row can override
  // it. Non-covered routes keep byte-identical behavior below.
  const seedOwnsRoute = SEED_COVERED_ROUTES.has(route);

  const allowDatabaseFallback =
    contentOwnsRoute || seedOwnsRoute
      ? false
      : (options?.allowDatabaseFallback ?? allowDatabaseFallbackInCurrentEnv());

  // Build-vs-runtime split.
  //   Build/SSG (allowDatabaseFallback === false): NEVER touch the DB — the static
  //   snapshot (or inline) is authoritative. Keeps the build DB-free/deterministic;
  //   behavior here is unchanged from before this fix.
  //   Runtime/ISR (allowDatabaseFallback === true): PREFER a live, active, complete
  //   content_pages row OVER the static snapshot, so a saved CMS edit + revalidatePath
  //   renders near-live. The static snapshot stays the fallback whenever the DB row is
  //   missing/inactive/incomplete or the DB read throws.
  if (allowDatabaseFallback) {
    let row: NonNullable<ContentPageRow> | null = null;
    try {
      // getContentPage already filters `is_active: true`, so a returned row is active.
      row = (await getContentPage(route, "en")) ?? null;
    } catch (err) {
      logOnce(
        `database-read-error:${route}`,
        "error",
        `[publicContent] content_pages read failed for "${route}" (${
          err instanceof Error ? err.message : String(err)
        }). Falling back to snapshot.`,
      );
      row = null;
    }

    const databaseSnapshot = row ? toSnapshot(route, row) : null;

    if (
      databaseSnapshot &&
      hasRequiredContentFields(databaseSnapshot, requiredContentFields)
    ) {
      logOnce(
        `database-prefer:${route}`,
        "warn",
        `[publicContent] Serving live content_pages row for "${route}" (DB preferred over static snapshot at runtime).`,
      );

      return {
        source: "database-fallback",
        snapshot: databaseSnapshot,
        pageRow: toPageRowFromContentPageRow(route, row as NonNullable<ContentPageRow>),
        usedDatabaseFallback: true,
      };
    }

    // DB row missing/inactive/incomplete → prefer the static snapshot when complete.
    if (snapshotIsComplete) {
      return {
        source: "snapshot",
        snapshot: snapshot!,
        pageRow: toPageRow(snapshot!),
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

  // Build/SSG path: snapshot-only, no DB dependency (unchanged behavior).
  if (snapshotIsComplete) {
    return {
      source: "snapshot",
      snapshot: snapshot!,
      pageRow: toPageRow(snapshot!),
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
