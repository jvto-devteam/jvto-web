/**
 * Sitemap <loc> reader for route reconciliation (T02, 2026-09-07).
 *
 * Pure: takes XML text, returns routes. It never fetches, so the caller decides
 * whether the bytes came from production, a running `next start`, or a file —
 * and the unit tests need no network and no fixture on disk.
 *
 * This is the THIRD place in the repo that reads <loc>. The second is inline
 * and unexported inside scripts/verify-live.mjs; importing it would mean editing
 * a shipped tool to expose an internal, which is the same trade T01 made when it
 * accepted a third copy of normalizeRoute rather than reach into the reader
 * layer. Recorded here so the duplication is a decision, not an accident.
 *
 * Every throw below replaces a value that would otherwise flow into a set
 * comparison and make it agree. An empty route list is indistinguishable from
 * "production publishes nothing", and a set difference against nothing is empty
 * — a green run. So this module refuses rather than returns.
 */
import { normalizeRoute } from "./normalizeRoute";

export type SitemapParseResult = Readonly<{
  /** First-seen order, normalized, one entry per distinct route. */
  routes: readonly string[];
  /** Routes whose <loc> appeared more than once, first-seen order. */
  duplicates: readonly string[];
}>;

const LOC = /<loc>([\s\S]*?)<\/loc>/g;

/**
 * The five predefined XML entities. Sitemaps must escape at least & and <, and
 * a raw "&amp;" left undecoded would turn one route into a route that does not
 * exist — which then reports as a mismatch on both sides.
 */
function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function parseSitemapUrls(
  xml: string,
  options: { expectOrigin: string },
): SitemapParseResult {
  let expected: URL;
  try {
    expected = new URL(options.expectOrigin);
  } catch {
    throw new Error(
      `parseSitemapUrls: expectOrigin must be an absolute origin, got ${JSON.stringify(
        options.expectOrigin,
      )}`,
    );
  }

  const seen = new Set<string>();
  const routes: string[] = [];
  const duplicates: string[] = [];
  let locCount = 0;

  for (const match of String(xml).matchAll(LOC)) {
    locCount += 1;
    const raw = decodeXmlEntities(match[1].trim());

    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new Error(
        `parseSitemapUrls: <loc> is not an absolute URL: ${JSON.stringify(raw)}`,
      );
    }

    if (url.origin !== expected.origin) {
      // Without this, a staging sitemap joins the inventory on pathname alone
      // and the entire run reports green against the wrong site. verify-live.mjs
      // does not check this; the gap is closed here rather than copied.
      throw new Error(
        `parseSitemapUrls: <loc> origin ${url.origin} does not match expected ${expected.origin} (${raw})`,
      );
    }

    // url("/") in src/lib/site.ts returns BASE_URL with no path, so the homepage
    // <loc> has an empty pathname. normalizeRoute maps "" and "/" to "/", which
    // keeps the homepage in the comparison instead of dropping it.
    const route = normalizeRoute(url.pathname);
    if (seen.has(route)) {
      if (!duplicates.includes(route)) duplicates.push(route);
      continue;
    }
    seen.add(route);
    routes.push(route);
  }

  if (locCount === 0) {
    throw new Error(
      "parseSitemapUrls: sitemap contained zero <loc> entries — refusing to report a pass",
    );
  }

  return { routes, duplicates };
}
