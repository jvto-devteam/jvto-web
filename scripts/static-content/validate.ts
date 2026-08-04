/**
 * content:validate — static-content structure gate (PACKAGE 01).
 *
 * Two phases, both required:
 *
 *  1. FIXTURE SELF-TEST — proves the validator itself works: every fixture
 *     root under scripts/static-content/fixtures/invalid/<case>/ MUST fail,
 *     and fixtures/valid/ MUST pass. If someone weakens a schema, this phase
 *     fails the gate even with an empty content/ tree.
 *
 *  2. REAL CONTENT — validates everything under <repo>/content/ (pages, faqs,
 *     entities): Zod shape, unique routes, faqKey resolution, single-H1 rule
 *     (AD-07), no placeholders on published pages, FAQ/entity file validity.
 *
 * Facts (2015/no-2016/mandatory-health/Package-Credit/review counts) are
 * enforced separately by scripts/validate-content-drift.mjs, which also scans
 * content/. This script checks structure, that one checks truth.
 *
 * Run: npm run content:validate   (part of content:check, runs on prebuild)
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  discoverEntityFiles,
  discoverFaqFiles,
  discoverPageFiles,
} from "../../src/lib/static-content/discoverContentFiles";
import { loadEntity } from "../../src/lib/static-content/loadEntity";
import { loadFaqSet } from "../../src/lib/static-content/loadFaqSet";
import {
  buildRouteIndex,
  clearRouteIndexCache,
} from "../../src/lib/static-content/loadStaticPage";
import { markdownHasH1, PLACEHOLDER_RE } from "../../src/lib/static-content/schemas";

const REPO_ROOT = join(__dirname, "..", "..");
const FIXTURES_ROOT = join(__dirname, "fixtures");
const CONTENT_ROOT = join(REPO_ROOT, "content");

type Problem = { file: string; message: string };

/** Validate one content root end-to-end. Returns problems (empty = valid). */
function validateContentRoot(contentRoot: string): Problem[] {
  const problems: Problem[] = [];
  clearRouteIndexCache(contentRoot);

  // Pages: Zod + duplicate routes + faqKey resolution all happen inside the index build.
  try {
    const index = buildRouteIndex(contentRoot);
    for (const [route, { page }] of index) {
      const label = `pages:${page.sourceFile}`;

      // AD-07 — no level-one heading in bodies (meta.title is the only H1).
      const bodies: string[] = [];
      if (page.body) bodies.push(page.body);
      for (const sec of page.sections ?? []) {
        if (sec.body_md) bodies.push(sec.body_md);
        for (const block of sec.blocks ?? []) {
          if (block.type === "markdown") bodies.push(block.body_md);
        }
      }
      if (bodies.some((b) => markdownHasH1(b))) {
        problems.push({ file: label, message: `route ${route}: Markdown body contains a level-one heading — start sections at "##" (AD-07)` });
      }

      // Published pages must not ship placeholders.
      if (page.meta.status === "published") {
        const searchable = [
          page.meta.title,
          page.meta.description,
          page.meta.summary,
          ...bodies,
          ...(page.lede ?? []),
          ...(page.faq ?? []).flatMap((f) => [f.question, f.answer]),
        ].join("\n");
        const hit = searchable.match(PLACEHOLDER_RE);
        if (hit) {
          problems.push({ file: label, message: `route ${route}: published page contains placeholder text ("${hit[0]}")` });
        }
      }
    }
  } catch (err) {
    problems.push({ file: "pages", message: (err as Error).message });
  }

  // FAQ sets: every file must be valid, even when no page references it yet.
  for (const f of discoverFaqFiles(contentRoot)) {
    const key = f.relPath.replace(/^faqs\//, "").replace(/\.json$/, "");
    try {
      loadFaqSet(key, contentRoot);
    } catch (err) {
      problems.push({ file: f.relPath, message: (err as Error).message });
    }
  }

  // Entities: base contract (valid JSON + lastReviewed date).
  for (const e of discoverEntityFiles(contentRoot)) {
    const name = e.relPath.replace(/^entities\//, "").replace(/\.json$/, "");
    try {
      loadEntity(name, contentRoot);
    } catch (err) {
      problems.push({ file: e.relPath, message: (err as Error).message });
    }
  }

  clearRouteIndexCache(contentRoot);
  return problems;
}

function runFixtureSelfTest(): boolean {
  let ok = true;

  // valid/ must pass completely.
  const validRoot = join(FIXTURES_ROOT, "valid");
  const validProblems = validateContentRoot(validRoot);
  if (validProblems.length > 0) {
    ok = false;
    console.error("✗ SELF-TEST: fixtures/valid should pass but failed:");
    for (const p of validProblems) console.error(`    ${p.file} — ${p.message}`);
  } else {
    const n = discoverPageFiles(validRoot).length;
    console.log(`✓ SELF-TEST: fixtures/valid passes (${n} page fixture(s))`);
  }

  // every invalid/<case>/ must fail.
  const invalidRoot = join(FIXTURES_ROOT, "invalid");
  let cases: string[] = [];
  try {
    cases = readdirSync(invalidRoot).filter((d) => statSync(join(invalidRoot, d)).isDirectory()).sort();
  } catch {
    /* none */
  }
  if (cases.length === 0) {
    ok = false;
    console.error("✗ SELF-TEST: no invalid fixture cases found — the gate cannot prove itself");
  }
  for (const c of cases) {
    const problems = validateContentRoot(join(invalidRoot, c));
    if (problems.length === 0) {
      ok = false;
      console.error(`✗ SELF-TEST: fixtures/invalid/${c} should FAIL but passed — validator gap`);
    } else {
      console.log(`✓ SELF-TEST: fixtures/invalid/${c} correctly fails (${problems[0].message.slice(0, 100)}…)`);
    }
  }
  return ok;
}

function main(): void {
  console.log("[content:validate] fixture self-test");
  const selfTestOk = runFixtureSelfTest();

  console.log("[content:validate] validating content/");
  const problems = validateContentRoot(CONTENT_ROOT);
  const pageCount = discoverPageFiles(CONTENT_ROOT).length;
  const faqCount = discoverFaqFiles(CONTENT_ROOT).length;
  const entityCount = discoverEntityFiles(CONTENT_ROOT).length;

  if (problems.length > 0) {
    console.error(`✗ content/ INVALID — ${problems.length} problem(s):`);
    for (const p of problems) console.error(`    ${p.file} — ${p.message}`);
  } else {
    console.log(`✓ content/ valid (${pageCount} page(s), ${faqCount} faq set(s), ${entityCount} entity file(s))`);
  }

  if (!selfTestOk || problems.length > 0) {
    console.error("[content:validate] FAIL");
    process.exit(1);
  }
  console.log("[content:validate] PASS");
}

main();
