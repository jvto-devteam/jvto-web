import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import {
  listPublishedStaticPages,
  loadStaticPage,
  type StaticPage,
} from "@/lib/static-content";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const PRODUCTION_ORIGIN = "https://javavolcano-touroperator.com";

export const ECOSYSTEM_CONTENT_REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

type EcosystemContentPayload =
  | {
      frontmatter?: Record<string, unknown>;
      body_md?: string;
    }
  | {
      meta?: Record<string, unknown>;
      sections?: EcosystemSection[];
      lede?: string[];
    };

export type EcosystemGridBlock = {
  type: "grid";
  role?: string;
  columns?: 2 | 3;
  items?: Array<Record<string, unknown>>;
};

export type EcosystemBlock =
  | { type: "markdown"; body_md?: string }
  | { type: "image"; src?: string; alt?: string; caption?: string | null }
  | EcosystemGridBlock
  | { type: "crew_grid"; items?: unknown[] };

export type EcosystemSection = {
  id: string;
  title?: string;
  body_md?: string;
  blocks?: EcosystemBlock[];
  items?: unknown[];
};

export type EcosystemFaqItem = {
  question: string;
  answer: string;
};

export type EcosystemWebsitePage = {
  schema_version: string;
  generated_at: string;
  route: string;
  domain: string;
  slug: string;
  status: "draft" | "published" | string;
  seo: {
    title?: string;
    description?: string;
    canonicalRoute?: string;
    schemaTypes?: string[];
  };
  page: {
    title?: string;
    summary?: string;
    owner?: string;
    lastReviewed?: string;
    faq?: {
      key?: string;
      payload?: {
        items?: EcosystemFaqItem[];
      };
    } | null;
    content?: {
      format?: "markdown" | "json" | "structured" | string;
      payload?: EcosystemContentPayload;
    };
  };
  faq?: {
    key?: string;
    payload?: {
      items?: EcosystemFaqItem[];
    };
  } | null;
};

export type EcosystemRouteIndex = {
  generated_at?: string;
  routes?: Array<{
    route: string;
    domain?: string;
    slug?: string;
    websiteOutput?: string;
    schemaOutput?: string;
  }>;
};

export type EcosystemStaticPage = {
  meta: {
    route: string;
    title: string;
    browserTitle?: string;
    description: string;
    section: string;
    status: string;
    owner?: string;
    lastReviewed?: string;
    schemaTypes?: string[];
    faqKey?: string;
    summary?: string;
  };
  canonicalUrl: string;
  format: "markdown" | "structured";
  body?: string;
  lede?: string[];
  sections?: EcosystemSection[];
  faq?: EcosystemFaqItem[];
  sourceFile: string;
  raw: EcosystemWebsitePage;
};

function normalizeRoute(route: string): string {
  let normalized = route.trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
}

function routeToOutputBase(route: string): string {
  return normalizeRoute(route).split("/").filter(Boolean).join("__") || "home";
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocalJson<T>(relativePath: string): Promise<T | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), relativePath),
      "utf8",
    );
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fetchJson<T>(
  pathname: string,
  searchParams?: URLSearchParams,
): Promise<T | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL(pathname, baseUrl);
    if (searchParams) url.search = searchParams.toString();

    const response = await fetch(url, {
      next: {
        revalidate: ECOSYSTEM_CONTENT_REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content"],
      },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function toStaticPage(payload: EcosystemWebsitePage): EcosystemStaticPage {
  const route = normalizeRoute(payload.route);
  const faq = payload.faq ?? payload.page.faq ?? null;
  const contentPayload = payload.page.content?.payload as
    Record<string, unknown> | undefined;
  const frontmatter =
    (contentPayload?.frontmatter as Record<string, unknown> | undefined) ??
    (contentPayload?.meta as Record<string, unknown> | undefined) ??
    {};
  const format =
    payload.page.content?.format === "markdown" ? "markdown" : "structured";

  return {
    meta: {
      route,
      title: String(
        frontmatter.title ?? payload.page.title ?? payload.seo.title ?? route,
      ),
      browserTitle:
        typeof frontmatter.browserTitle === "string"
          ? frontmatter.browserTitle
          : payload.seo.title,
      description: String(
        frontmatter.description ??
          payload.seo.description ??
          payload.page.summary ??
          "",
      ),
      section: String(frontmatter.section ?? payload.domain),
      status: String(frontmatter.status ?? payload.status),
      owner:
        typeof frontmatter.owner === "string"
          ? frontmatter.owner
          : payload.page.owner,
      lastReviewed:
        typeof frontmatter.lastReviewed === "string"
          ? frontmatter.lastReviewed
          : payload.page.lastReviewed,
      schemaTypes: Array.isArray(frontmatter.schemaTypes)
        ? (frontmatter.schemaTypes as string[])
        : payload.seo.schemaTypes,
      faqKey:
        typeof frontmatter.faqKey === "string" ? frontmatter.faqKey : faq?.key,
      summary:
        typeof frontmatter.summary === "string"
          ? frontmatter.summary
          : payload.page.summary,
    },
    canonicalUrl: `${PRODUCTION_ORIGIN}${payload.seo.canonicalRoute ?? route}`,
    format,
    body:
      typeof contentPayload?.body_md === "string"
        ? contentPayload.body_md
        : undefined,
    lede: Array.isArray(contentPayload?.lede)
      ? (contentPayload.lede as string[])
      : undefined,
    sections: normalizeSections(contentPayload?.sections),
    faq: faq?.payload?.items ?? undefined,
    sourceFile: `jvto-ekosistem:${route}`,
    raw: payload,
  };
}

function staticContentToEcosystemPage(page: StaticPage): EcosystemStaticPage {
  const route = normalizeRoute(page.meta.route);
  const slug = route.split("/").filter(Boolean).pop() ?? route;
  const faqPayload = page.faq?.length
    ? { key: page.meta.faqKey, payload: { items: page.faq } }
    : null;
  const contentPayload =
    page.format === "markdown"
      ? {
          frontmatter: page.meta,
          body_md: page.body,
        }
      : {
          meta: page.meta,
          lede: page.lede,
          sections: page.sections,
        };

  return {
    meta: {
      route,
      title: page.meta.title,
      browserTitle: page.meta.browserTitle,
      description: page.meta.description,
      section: page.meta.section,
      status: page.meta.status,
      owner: page.meta.owner,
      lastReviewed: page.meta.lastReviewed,
      schemaTypes: page.meta.schemaTypes,
      faqKey: page.meta.faqKey,
      summary: page.meta.summary,
    },
    canonicalUrl: page.canonicalUrl,
    format: page.format,
    body: page.body,
    lede: page.lede,
    sections: normalizeSections(page.sections),
    faq: page.faq,
    sourceFile: page.sourceFile,
    raw: {
      schema_version: "static-content-fallback",
      generated_at: "static-content-fallback",
      route,
      domain: page.meta.section,
      slug,
      status: page.meta.status,
      seo: {
        title: page.meta.browserTitle ?? page.meta.title,
        description: page.meta.description,
        canonicalRoute: route,
        schemaTypes: page.meta.schemaTypes,
      },
      page: {
        title: page.meta.title,
        summary: page.meta.summary,
        owner: page.meta.owner,
        lastReviewed: page.meta.lastReviewed,
        faq: faqPayload,
        content: {
          format: page.format,
          payload: contentPayload,
        },
      },
      faq: faqPayload,
    },
  };
}

function normalizeSections(sections: unknown): EcosystemSection[] | undefined {
  if (!Array.isArray(sections)) return undefined;

  return sections.map((rawSection) => {
    const section =
      rawSection && typeof rawSection === "object"
        ? (rawSection as EcosystemSection)
        : ({
            id: String(rawSection),
            title: String(rawSection),
          } satisfies EcosystemSection);

    if (
      section.blocks?.length ||
      !Array.isArray(section.items) ||
      section.items.length === 0
    ) {
      return section;
    }

    const items = section.items.map((item, index) => {
      if (item && typeof item === "object")
        return item as Record<string, unknown>;
      return { label: String(index + 1), text: item };
    });

    return {
      ...section,
      blocks: [
        {
          type: "grid",
          items,
        },
      ],
    };
  });
}

export async function getEcosystemWebsitePage(
  route: string,
): Promise<EcosystemStaticPage | null> {
  const normalizedRoute = normalizeRoute(route);

  if (!process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL) {
    const localPayload = await readLocalJson<EcosystemWebsitePage>(
      path.join(
        "5-experience-engine",
        "public-website",
        "pages",
        `${routeToOutputBase(normalizedRoute)}.website-output.json`,
      ),
    );
    if (localPayload) return toStaticPage(localPayload);
  }

  const response = await fetchJson<{
    route: string;
    outputPath: string;
    payload: EcosystemWebsitePage;
  }>("/api/website/page", new URLSearchParams({ route: normalizedRoute }));

  if (response?.payload) return toStaticPage(response.payload);

  const fallbackPayload = await readLocalJson<EcosystemWebsitePage>(
    path.join(
      "5-experience-engine",
      "public-website",
      "pages",
      `${routeToOutputBase(normalizedRoute)}.website-output.json`,
    ),
  );

  if (fallbackPayload) return toStaticPage(fallbackPayload);

  const staticPage = loadStaticPage(normalizedRoute);
  if (staticPage?.meta.status === "published") {
    return staticContentToEcosystemPage(staticPage);
  }

  return null;
}

export async function getEcosystemWebsiteRoutes(): Promise<EcosystemRouteIndex> {
  if (!process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL) {
    const localIndex = await readLocalJson<EcosystemRouteIndex>(
      path.join("5-experience-engine", "manifests", "route-output-index.json"),
    );
    if (localIndex) return localIndex;
  }

  const response = await fetchJson<{
    outputPath: string;
    payload: EcosystemRouteIndex;
  }>("/api/website/routes");

  if (response?.payload) return response.payload;

  const fallbackIndex = await readLocalJson<EcosystemRouteIndex>(
    path.join("5-experience-engine", "manifests", "route-output-index.json"),
  );
  if (fallbackIndex) return fallbackIndex;

  return {
    generated_at: "static-content-fallback",
    routes: listPublishedStaticPages().map((page) => ({
      route: normalizeRoute(page.meta.route),
      domain: page.meta.section,
      slug: normalizeRoute(page.meta.route).split("/").filter(Boolean).pop(),
      websiteOutput: page.sourceFile,
    })),
  };
}

export function buildEcosystemRouteMetadata(
  page: EcosystemStaticPage,
  type: "article" | "website" = "article",
): Metadata {
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;

  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl },
    openGraph: {
      title,
      description,
      url: `${PRODUCTION_ORIGIN}${page.meta.route}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type,
    },
  };
}
