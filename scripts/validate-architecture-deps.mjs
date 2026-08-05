#!/usr/bin/env node
/**
 * validate-architecture-deps.mjs — architecture dependency gate (Milestone 1, handoff §16).
 *
 * Enforces module boundaries on the NEW modular tree (src/domains, src/application,
 * src/infrastructure) ONLY — existing app code is out of scope until it is migrated
 * (handoff §5.1). Blocks forbidden cross-domain / cross-layer imports:
 *   - domains are persistence- and UI-agnostic (no prisma, no app/components/presentation);
 *   - a domain may not import another domain except via domains/shared;
 *   - shared may not depend on any specific domain or on infra/app/prisma;
 *   - infrastructure + application stay independent of the Next UI.
 *
 * Pure Node ESM (fs only). `--selftest` proves the matcher before trusting a real run.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(REPO_ROOT, "src");
const SCAN_DIRS = [join(SRC, "domains"), join(SRC, "application"), join(SRC, "infrastructure")];

const failures = [];
const fail = (m) => failures.push(m);

/** Classify a repo-relative path (posix) into an architecture zone. */
function zoneOfPath(relPath) {
  const p = relPath.replace(/\\/g, "/");
  if (p.startsWith("src/domains/shared")) return "shared";
  const dm = p.match(/^src\/domains\/([^/]+)/);
  if (dm) return `domain:${dm[1]}`;
  if (p.startsWith("src/application")) return "application";
  if (p.startsWith("src/infrastructure")) return "infrastructure";
  if (p.startsWith("src/app/") || p.startsWith("src/components/") || p.startsWith("src/presentation/"))
    return "ui";
  if (p.startsWith("src/lib/prisma") || p.startsWith("src/generated/prisma")) return "prisma";
  return "other-internal";
}

/** Classify an import specifier (from an importing file) into a zone, or null if external. */
function zoneOfImport(spec, fromFileRel) {
  if (spec === "@prisma/client" || spec === "prisma") return "prisma";
  if (spec.startsWith("@/")) return zoneOfPath("src/" + spec.slice(2));
  if (spec.startsWith("./") || spec.startsWith("../")) {
    const abs = join(dirname(join(REPO_ROOT, fromFileRel)), spec);
    return zoneOfPath(relative(REPO_ROOT, abs).replace(/\\/g, "/"));
  }
  return null; // bare/external/builtin — allowed
}

/** Is importer → imported allowed? Returns null if allowed, else a reason string. */
export function violationFor(importerZone, importedZone) {
  if (importedZone === null || importedZone === "other-internal" || importedZone === "shared") return null;
  const isDomain = importerZone.startsWith("domain:");
  if (importerZone === "shared") {
    if (importedZone.startsWith("domain:") || ["prisma", "ui", "application", "infrastructure"].includes(importedZone))
      return "domains/shared must not depend on a domain, infra, application, prisma, or UI";
    return null;
  }
  if (isDomain) {
    if (importedZone === "ui") return "a domain must not import UI (app/components/presentation)";
    if (importedZone === "prisma") return "a domain must not import prisma directly (persistence-agnostic)";
    if (importedZone === "application") return "a domain must not depend on the application layer";
    if (importedZone === "infrastructure") return "a domain must not import infrastructure directly";
    if (importedZone.startsWith("domain:") && importedZone !== importerZone)
      return `cross-domain import (${importerZone} → ${importedZone}); go through domains/shared`;
    return null;
  }
  if (importerZone === "application") {
    if (importedZone === "ui") return "the application layer must not import UI";
    if (importedZone === "prisma") return "the application layer must not import prisma directly (inject a repository)";
    return null;
  }
  if (importerZone === "infrastructure") {
    if (importedZone === "ui") return "infrastructure must not import UI";
    if (importedZone === "application") return "infrastructure must not depend on the application layer";
    return null;
  }
  return null;
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

function importsOf(text) {
  const out = [];
  // static: `import x from "y"`, `export … from "y"`, bare `import "y"`.
  const staticRe = /(?:from|import)\s+["']([^"']+)["']/g;
  // dynamic: `import("y")` / `await import("y")` — a forbidden dep hidden here must
  // still be caught, or the gate can pass while a boundary is violated.
  const dynRe = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  let m;
  while ((m = staticRe.exec(text))) out.push(m[1]);
  while ((m = dynRe.exec(text))) out.push(m[1]);
  return out;
}

function run() {
  let scanned = 0;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      scanned += 1;
      const relFile = relative(REPO_ROOT, file).replace(/\\/g, "/");
      const importerZone = zoneOfPath(relFile);
      for (const spec of importsOf(readFileSync(file, "utf8"))) {
        const importedZone = zoneOfImport(spec, relFile);
        const reason = violationFor(importerZone, importedZone);
        if (reason) fail(`${relFile}: ${reason} (import "${spec}")`);
      }
    }
  }
  return scanned;
}

function selftest() {
  const cases = [
    ["domain:booking", "ui", true],
    ["domain:booking", "prisma", true],
    ["domain:booking", "domain:payment", true],
    ["domain:booking", "domain:booking", false],
    ["domain:booking", "shared", false],
    ["domain:booking", null, false],
    ["domain:booking", "application", true],
    ["domain:booking", "infrastructure", true],
    ["shared", "domain:pricing", true],
    ["shared", "prisma", true],
    ["shared", "shared", false],
    ["application", "prisma", true],
    ["application", "ui", true],
    ["application", "domain:booking", false],
    ["application", "infrastructure", false],
    ["infrastructure", "ui", true],
    ["infrastructure", "application", true],
    ["infrastructure", "prisma", false],
    ["infrastructure", "domain:booking", false],
  ];
  let ok = true;
  for (const [imp, imported, shouldFail] of cases) {
    const got = violationFor(imp, imported) !== null;
    if (got !== shouldFail) {
      ok = false;
      console.error(`✗ SELF-TEST: ${imp} → ${imported} expected fail=${shouldFail}, got ${got}`);
    }
  }
  // importsOf must capture BOTH static and dynamic imports.
  const parsed = importsOf('import a from "@/x";\nawait import("@/app/foo");\nconst y = import ( "@/lib/prisma" );');
  for (const need of ["@/x", "@/app/foo", "@/lib/prisma"]) {
    if (!parsed.includes(need)) {
      ok = false;
      console.error(`✗ SELF-TEST: importsOf missed "${need}" (static/dynamic parse gap)`);
    }
  }
  if (!ok) {
    console.error("[architecture-deps] SELF-TEST FAILED");
    process.exit(1);
  }
  console.log(`[architecture-deps] self-test PASS (${cases.length} boundary cases + static/dynamic import parse)`);
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}
selftest();
const scanned = run();
if (failures.length) {
  console.error(`\n[architecture-deps] FAIL — ${failures.length} boundary violation(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`[architecture-deps] PASS — ${scanned} module file(s), no forbidden cross-domain/cross-layer imports.`);
