/**
 * content:validate-links — internal-link gate for static content (PACKAGE 01).
 *
 * A published page's internal links must resolve against:
 *   1. published static-content routes (content/pages/**), plus
 *   2. live routes in PAGE_REGISTRY (src/lib/registry/pages.ts), plus
 *   3. known dynamic namespaces (tours/destinations/blog/team detail pages
 *      whose params come from the DB or the blog manifest, not the registry).
 *
 * Links to registry entries with status "redirect"/"dead" fail — content must
 * link the canonical target, not a redirect (blueprint §PACKAGE 07).
 * External URLs are syntax-checked only (never fetched at build time).
 *
 * Includes a fixture self-test: fixtures/link-invalid/<case>/ must FAIL.
 *
 * Run: npm run content:validate-links   (part of content:check)
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PAGE_REGISTRY } from "../../src/lib/registry/pages";
import { discoverPageFiles } from "../../src/lib/static-content/discoverContentFiles";
import {
  buildRouteIndex,
  clearRouteIndexCache,
  normalizeRoute,
} from "../../src/lib/static-content/loadStaticPage";
import { extractInternalLinks } from "../../src/lib/static-content/schemas";

const REPO_ROOT = join(__dirname, "..", "..");
const FIXTURES_ROOT = join(__dirname, "fixtures");
const CONTENT_ROOT = join(REPO_ROOT, "content");

/** Detail-page namespaces whose params are dynamic (DB/manifest), not registry. */
const DYNAMIC_PREFIXES = [
  "/tours/",
  "/destinations/",
  "/blog/",
  "/team/",
  "/why-jvto/reviews/",
];

type Problem = { file: string; message: string };

function knownRegistryRoutes(): { live: Set<string>; redirected: Map<string, string> } {
  const live = new Set<string>();
  const redirected = new Map<string, string>();
  for (const entry of PAGE_REGISTRY) {
    if (entry.status === "live") live.add(normalizeRoute(entry.route));
    else redirected.set(normalizeRoute(entry.route), entry.redirectsTo ?? "(gone)");
  }
  return { live, redirected };
}

function collectBodies(page: {
  body?: string;
  lede?: string[];
  sections?: Array<{ body_md?: string; blocks?: Array<{ type: string; body_md?: string }> }>;
  faq?: Array<{ answer: string }>;
}): string[] {
  const bodies: string[] = [];
  if (page.body) bodies.push(page.body);
  for (const sec of page.sections ?? []) {
    if (sec.body_md) bodies.push(sec.body_md);
    for (const b of sec.blocks ?? []) if (b.type === "markdown" && b.body_md) bodies.push(b.body_md);
  }
  for (const f of page.faq ?? []) bodies.push(f.answer);
  return bodies;
}

function validateLinks(contentRoot: string): Problem[] {
  const problems: Problem[] = [];
  clearRouteIndexCache(contentRoot);

  let index;
  try {
    index = buildRouteIndex(contentRoot);
  } catch (err) {
    clearRouteIndexCache(contentRoot);
    return [{ file: "pages", message: (err as Error).message }];
  }

  const contentRoutes = new Set(
    [...index.values()]
      .filter((e) => e.page.meta.status === "published")
      .map((e) => normalizeRoute(e.page.meta.route)),
  );
  const { live, redirected } = knownRegistryRoutes();

  for (const { page } of index.values()) {
    if (page.meta.status !== "published") continue; // drafts may link WIP targets
    for (const body of collectBodies(page)) {
      for (const raw of extractInternalLinks(body)) {
        const target = normalizeRoute(raw);
        if (contentRoutes.has(target) || live.has(target)) continue;
        if (DYNAMIC_PREFIXES.some((p) => target.startsWith(p))) continue;
        if (redirected.has(target)) {
          problems.push({
            file: page.sourceFile,
            message: `route ${page.meta.route}: links "${target}" which is a redirect/dead registry route (→ ${redirected.get(target)}) — link the canonical target`,
          });
          continue;
        }
        problems.push({
          file: page.sourceFile,
          message: `route ${page.meta.route}: broken internal link "${target}" (not a published content route, not a live registry route)`,
        });
      }

      // External URLs: syntax check only.
      const extRe = /\]\((https?:\/\/[^)\s]+)\)/g;
      let m: RegExpExecArray | null;
      while ((m = extRe.exec(body)) !== null) {
        try {
          new URL(m[1]);
        } catch {
          problems.push({ file: page.sourceFile, message: `route ${page.meta.route}: malformed external URL "${m[1]}"` });
        }
      }
    }
  }

  clearRouteIndexCache(contentRoot);
  return problems;
}

function runFixtureSelfTest(): boolean {
  let ok = true;
  const invalidRoot = join(FIXTURES_ROOT, "link-invalid");
  let cases: string[] = [];
  try {
    cases = readdirSync(invalidRoot).filter((d) => statSync(join(invalidRoot, d)).isDirectory()).sort();
  } catch {
    /* none */
  }
  if (cases.length === 0) {
    console.error("✗ SELF-TEST: no link-invalid fixture cases found");
    return false;
  }
  for (const c of cases) {
    const problems = validateLinks(join(invalidRoot, c));
    if (problems.length === 0) {
      ok = false;
      console.error(`✗ SELF-TEST: fixtures/link-invalid/${c} should FAIL but passed`);
    } else {
      console.log(`✓ SELF-TEST: fixtures/link-invalid/${c} correctly fails`);
    }
  }
  // the valid fixture root must also link-validate cleanly
  const validProblems = validateLinks(join(FIXTURES_ROOT, "valid"));
  if (validProblems.length > 0) {
    ok = false;
    console.error("✗ SELF-TEST: fixtures/valid has link problems:");
    for (const p of validProblems) console.error(`    ${p.file} — ${p.message}`);
  } else {
    console.log("✓ SELF-TEST: fixtures/valid links resolve");
  }
  return ok;
}

function main(): void {
  console.log("[content:validate-links] fixture self-test");
  const selfTestOk = runFixtureSelfTest();

  console.log("[content:validate-links] validating content/ links");
  const problems = validateLinks(CONTENT_ROOT);
  const pageCount = discoverPageFiles(CONTENT_ROOT).length;
  if (problems.length > 0) {
    console.error(`✗ content/ link check FAILED — ${problems.length} problem(s):`);
    for (const p of problems) console.error(`    ${p.file} — ${p.message}`);
  } else {
    console.log(`✓ content/ links resolve (${pageCount} page(s))`);
  }

  if (!selfTestOk || problems.length > 0) {
    console.error("[content:validate-links] FAIL");
    process.exit(1);
  }
  console.log("[content:validate-links] PASS");
}

main();
