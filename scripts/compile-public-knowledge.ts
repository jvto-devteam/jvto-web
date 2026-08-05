/**
 * Milestone 2 — Public Knowledge Compiler (handoff §16).
 *
 * ONE compiler that reads the `content/` Git SSOT (pages + faqs + entities via
 * `src/lib/static-content`) and emits a single deterministic manifest —
 * `src/lib/publicContent/generated/public-knowledge.json` — carrying, per migrated
 * public route: canonical URL, metadata (title/browserTitle/description/summary),
 * declared schema types, faq linkage, lastReviewed, owner. The manifest is the
 * machine-readable projection the sitemap, canonical/metadata, JSON-LD, and the
 * public knowledge feed (`/api/knowledge-feed`) read through.
 *
 * DETERMINISTIC: sorted, no timestamp, no git SHA baked in — so a CI drift gate can
 * regenerate and fail on any non-empty `git diff` (mirrors the Milestone 0
 * authority-consumer-manifest pattern). The EXACT SOURCE COMMIT is recorded at SERVE
 * time by the feed route (from the deployed APP_COMMIT_SHA), never frozen into the
 * committed artifact — otherwise the drift gate would fail on every commit. Integrity
 * of the committed content is captured by `contentDigest` (a stable SHA-256).
 *
 * Read-only w.r.t. app behavior; touches no Prisma/network (the loader is fs-only).
 *
 * Run:   npx tsx scripts/compile-public-knowledge.ts        (writes the manifest)
 *        npx tsx scripts/compile-public-knowledge.ts --selftest
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  listPublishedStaticPages,
  discoverEntityFiles,
  defaultContentRoot,
} from "../src/lib/static-content";

const REPO_ROOT = join(__dirname, "..");
const OUT_JSON = join(REPO_ROOT, "src", "lib", "publicContent", "generated", "public-knowledge.json");

const SCHEMA_VERSION = 1;

export type KnowledgeRouteEntry = {
  route: string;
  section: string;
  canonicalUrl: string;
  title: string;
  browserTitle: string;
  description: string;
  summary: string;
  schemaTypes: string[];
  owner: string;
  lastReviewed: string;
  faqKey: string | null;
  faqCount: number;
};

export type PublicKnowledgeManifest = {
  schemaVersion: number;
  generator: string;
  productionOrigin: string;
  routes: KnowledgeRouteEntry[];
  entities: string[];
  counts: { routes: number; entities: number; sections: Record<string, number> };
  /** SHA-256 over the deterministic payload (all fields except this one). */
  contentDigest: string;
};

/** Build the manifest from content/ (pure — no writes). */
export function compile(contentRoot = defaultContentRoot()): PublicKnowledgeManifest {
  const pages = listPublishedStaticPages({}, contentRoot);

  const routes: KnowledgeRouteEntry[] = pages
    .map((p) => ({
      route: p.meta.route,
      section: p.meta.section,
      canonicalUrl: p.canonicalUrl,
      title: p.meta.title,
      browserTitle: p.meta.browserTitle ?? p.meta.title,
      description: p.meta.description,
      summary: p.meta.summary,
      schemaTypes: [...p.meta.schemaTypes].sort(),
      owner: p.meta.owner,
      lastReviewed: p.meta.lastReviewed,
      faqKey: p.meta.faqKey ?? null,
      // Referential integrity: loadStaticPage already throws if faqKey has no file,
      // so a resolved count > 0 here proves the FAQ set exists and is non-empty.
      faqCount: p.faq?.length ?? 0,
    }))
    .sort((a, b) => (a.route < b.route ? -1 : a.route > b.route ? 1 : 0));

  const entities = discoverEntityFiles(contentRoot)
    .map((f) => f.relPath.replace(/^entities\//, "").replace(/\.json$/, ""))
    .sort();

  const sections: Record<string, number> = {};
  for (const r of routes) sections[r.section] = (sections[r.section] ?? 0) + 1;
  const orderedSections: Record<string, number> = {};
  for (const k of Object.keys(sections).sort()) orderedSections[k] = sections[k];

  const payload: Omit<PublicKnowledgeManifest, "contentDigest"> = {
    schemaVersion: SCHEMA_VERSION,
    generator: "scripts/compile-public-knowledge.ts",
    productionOrigin: "https://javavolcano-touroperator.com",
    routes,
    entities,
    counts: { routes: routes.length, entities: entities.length, sections: orderedSections },
  };

  const contentDigest = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return { ...payload, contentDigest };
}

/** Serialize deterministically (stable key order via the typed shape + 2-space indent). */
export function serialize(manifest: PublicKnowledgeManifest): string {
  return JSON.stringify(manifest, null, 2) + "\n";
}

function selftest(): void {
  let ok = true;
  const check = (cond: boolean, label: string) => {
    console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
    if (!cond) ok = false;
  };

  const a = compile();
  const b = compile();
  check(serialize(a) === serialize(b), "compile is deterministic (two runs are byte-identical)");
  check(a.routes.length > 0, "manifest has at least one migrated route");
  check(
    a.routes.every((r) => r.canonicalUrl === a.productionOrigin + r.route),
    "every canonicalUrl = productionOrigin + route (AD-06)",
  );
  check(
    a.routes.every((r) => r.faqKey === null || r.faqCount > 0),
    "every route with a faqKey resolves a non-empty FAQ set (referential integrity)",
  );
  check(
    a.routes.every((r) => r.schemaTypes.length > 0 && r.title && r.description && r.canonicalUrl),
    "every route carries schemaTypes + title + description + canonical",
  );
  const sorted = [...a.routes].every((r, i, arr) => i === 0 || arr[i - 1].route <= r.route);
  check(sorted, "routes are sorted by route (stable diff)");
  check(
    a.contentDigest === compile().contentDigest,
    "contentDigest is stable across runs",
  );
  // Tampering with content changes the digest.
  const mutated = { ...a, routes: a.routes.slice(1) };
  const reDigest = createHash("sha256")
    .update(
      JSON.stringify({
        schemaVersion: mutated.schemaVersion,
        generator: mutated.generator,
        productionOrigin: mutated.productionOrigin,
        routes: mutated.routes,
        entities: mutated.entities,
        counts: mutated.counts,
      }),
    )
    .digest("hex");
  check(reDigest !== a.contentDigest, "contentDigest changes when content changes");

  if (!ok) {
    console.error("[compile-public-knowledge] SELF-TEST FAILED");
    process.exit(1);
  }
  console.log("[compile-public-knowledge] self-test PASS");
}

const argv = process.argv.slice(2);
const isDirectRun = !!process.argv[1] && /compile-public-knowledge\.ts$/.test(process.argv[1]);
if (isDirectRun) {
  if (argv.includes("--selftest")) {
    selftest();
  } else {
    const manifest = compile();
    writeFileSync(OUT_JSON, serialize(manifest));
    console.log(
      `[compile-public-knowledge] wrote ${manifest.routes.length} routes + ` +
        `${manifest.entities.length} entities → src/lib/publicContent/generated/public-knowledge.json ` +
        `(digest ${manifest.contentDigest.slice(0, 12)}…)`,
    );
  }
}
