/**
 * reconcile-route-outputs — T02, 2026-09-07.
 *
 * Reconciles three independent observations of what is public, and gives every
 * difference a name:
 *
 *   1. the T01 public route inventory  — what THIS CHECKOUT intends to publish
 *   2. the live sitemap.xml            — what PRODUCTION actually publishes
 *   3. ekosistem's route-output-index  — what EKOSISTEM generated
 *
 * Usage — the two node flags are not optional, use `npm run reconcile:routes`:
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
 *        --import ./scripts/lib/register-ts-hook.mjs \
 *        scripts/reconcile-route-outputs.mjs [flags]
 *
 * THIS IS A POST-DEPLOY VERIFIER, NOT A PRE-COMMIT GATE. It observes
 * production, so it needs the network and it can legitimately report a state
 * that no code change caused. `npm run validate:public-routes` (T01) is the
 * pre-commit gate and deliberately needs neither network nor this manifest —
 * do not merge the two, or the foundation validator starts depending on
 * production being up.
 *
 * WHY THE SITEMAP COMES OVER HTTP AND NOT FROM src/app/**\/sitemap.data.ts
 *
 * Measured 2026-09-07: all eight sitemap.data.ts files read the SAME loaders
 * this script's inventory comes from. Recomputing the sitemap locally and
 * diffing it against the inventory is a tautology for the 267 dynamic routes,
 * and T01's drift guard already covers the 38 static ones. It would pass
 * forever, including on the day production breaks. Rule 8 says the same thing
 * from the other direction: rendered output is verified from a running server.
 *
 * Exit codes (same contract as scripts/verify-live.mjs):
 *   0  reconciliation complete, no FAIL rows
 *   1  the measurement happened and the contract is violated
 *   2  the measurement did NOT happen — bad flags, unreachable or implausible
 *      input. This differs from T01, which folds its floor breaches into
 *      violations and exits 1. Noted rather than left as a silent divergence:
 *      a truncated manifest is not "the contract is wrong", it is "I could not
 *      measure", and the two deserve different codes.
 *
 * The src imports below carry an explicit .ts extension; the sibling .test.ts
 * file imports the same modules WITHOUT one. Both are correct — see the header
 * of scripts/validate-public-route-contract.mjs.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildPublicRouteInventory } from "../src/lib/routes/buildPublicRouteInventory.ts";
import { parseSitemapUrls } from "../src/lib/routes/parseSitemapUrls.ts";
import { parseRouteOutputIndex } from "../src/lib/routes/parseRouteOutputIndex.ts";
import {
  reconcileRoutes,
  summarizeReconciliation,
  CLASSIFICATIONS,
} from "../src/lib/routes/reconcileRoutes.ts";
import { reconciliationToCsv } from "../src/lib/routes/reconciliationToCsv.ts";
// Imported, never reimplemented: a second copy of SOURCE_FLOORS would drift from
// T01's, and a drifted floor is a disabled guard that still looks like a guard.
import {
  loadSources,
  SOURCE_FLOORS,
} from "./validate-public-route-contract.mjs";

const DEFAULT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

const DEFAULT_MANIFEST = path.join(
  process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ?? path.resolve(process.cwd(), "..", "jvto-ekosistem"),
  "5-experience-engine",
  "manifests",
  "route-output-index.json",
);

/**
 * Floors, not equalities: growth passes, shrinkage stops the run.
 *
 * Measured 2026-09-07 — live sitemap 302 <loc>, manifest 299 entries. Without
 * these, a truncated HTTP response or a partially-written manifest produces a
 * plausible-looking report in which most routes are simply "missing", and if the
 * contract expects nothing from them it can even read as a clean PASS.
 *
 * Lowering one to make a run pass, without saying in the same commit why the
 * real count dropped, is disabling the guard rather than maintaining it.
 */
const LIVE_SITEMAP_FLOOR = 302;
const MANIFEST_ENTRY_FLOOR = 299;

// ---------------------------------------------------------------- arguments

// Copied in shape from verify-live.mjs:105-128, including the reasons. That
// shape exists because the hand-written per-flag blocks it replaced guaranteed
// an omission; a flag added here cannot skip validation by being forgotten.
const bareOrigin = (v) => {
  let u;
  try {
    u = new URL(v);
  } catch {
    return false;
  }
  return (
    (u.protocol === "http:" || u.protocol === "https:") &&
    u.pathname === "/" &&
    u.search === "" &&
    u.hash === "" &&
    u.username === "" &&
    u.password === ""
  );
};

const BASE_EXPECTED = "an http(s) origin with no path, query or fragment";
const normalizeBase = (v) => v.trim().replace(/\/+$/, "");

const FLAGS = {
  "--quiet": { boolean: true, key: "quiet" },
  "--fail-on-warn": { boolean: true, key: "failOnWarn" },
  "--base": { key: "base", coerce: normalizeBase, validate: bareOrigin, expected: BASE_EXPECTED },
  "--sitemap-file": { key: "sitemapFile" },
  "--manifest": { key: "manifest" },
  "--json": { key: "json" },
  "--csv": { key: "csv" },
};

class UsageError extends Error {}

function parseArgs(argv) {
  const opts = {
    base: DEFAULT_BASE,
    baseExplicit: false,
    sitemapFile: null,
    manifest: DEFAULT_MANIFEST,
    json: null,
    csv: null,
    quiet: false,
    failOnWarn: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    // Object.hasOwn, not a bare lookup: FLAGS["toString"] resolves
    // Object.prototype.toString — truthy, with no `key` — and sailed past the
    // unknown-argument guard in verify-live before this was fixed there.
    const spec = Object.hasOwn(FLAGS, flag) ? FLAGS[flag] : undefined;
    if (!spec) throw new UsageError(`unknown argument: ${flag}`);
    if (spec.boolean) {
      opts[spec.key] = true;
      continue;
    }
    const raw = argv[i + 1];
    if (raw === undefined || raw === "" || raw.startsWith("--")) {
      throw new UsageError(`${flag} needs a value`);
    }
    i += 1;
    const parsed = spec.coerce ? spec.coerce(raw) : raw;
    if (spec.validate && !spec.validate(parsed)) {
      throw new UsageError(`${flag} must be ${spec.expected}, got ${JSON.stringify(raw)}`);
    }
    if (spec.key === "base") opts.baseExplicit = true;
    opts[spec.key] = parsed;
  }

  // Refuse rather than pick. verify-live silently dropped --routes when
  // --sitemap was also given, which meant a curated list could be replaced by a
  // full sweep without a word. Two sources of the same observation is a
  // question about intent, and guessing at it is how a run measures something
  // other than what was asked for.
  if (opts.baseExplicit && opts.sitemapFile) {
    throw new UsageError("--base and --sitemap-file both given; pass exactly one");
  }

  // The default base comes from the environment, so it clears the same bar as a
  // supplied one — the loop above only sees --base when it is passed.
  opts.base = normalizeBase(opts.base);
  if (!bareOrigin(opts.base)) {
    throw new UsageError(
      `base must be ${BASE_EXPECTED}, got ${JSON.stringify(opts.base)} (from ${
        process.env.NEXT_PUBLIC_SITE_URL ? "NEXT_PUBLIC_SITE_URL" : "the built-in default"
      })`,
    );
  }
  return opts;
}

// ------------------------------------------------------------- observations

async function readSitemap(opts) {
  if (opts.sitemapFile) {
    // Legitimate for two things only: a no-network run, and the Rule 8-compliant
    // local observation (`npm run build && npx next start`, then curl the
    // running server). Pointing it at a hand-written list makes the comparison a
    // tautology — the file is an observation, not a wish.
    let xml;
    try {
      xml = readFileSync(opts.sitemapFile, "utf8");
    } catch (error) {
      throw new UsageError(`cannot read --sitemap-file ${opts.sitemapFile}: ${error.message}`);
    }
    // Same floor as the HTTP path. Exempting the file path would make it a
    // bypass rather than an escape hatch.
    return { source: opts.sitemapFile, ...parseSitemapUrls(xml, { expectOrigin: opts.base }) };
  }

  const url = `${opts.base}/sitemap.xml`;
  let response;
  try {
    // connection: close for the same libuv reason verify-live carries it.
    response = await fetch(url, { headers: { connection: "close" } });
  } catch (error) {
    throw new UsageError(`cannot fetch ${url}: ${error.message}`);
  }
  if (!response.ok) {
    throw new UsageError(`${url} returned HTTP ${response.status}`);
  }
  return { source: url, ...parseSitemapUrls(await response.text(), { expectOrigin: opts.base }) };
}

function readManifest(opts) {
  let raw;
  try {
    raw = readFileSync(opts.manifest, "utf8");
  } catch (error) {
    throw new UsageError(`cannot read manifest ${opts.manifest}: ${error.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new UsageError(`manifest ${opts.manifest} is not valid JSON: ${error.message}`);
  }
  return parseRouteOutputIndex(parsed);
}

// -------------------------------------------------------------------- main

async function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      console.error(`${error.message} — refusing to run`);
      return 2;
    }
    throw error;
  }

  let sitemap;
  let routeOutputIndex;
  let report;
  // 2026-09-07, adversarial review: buildPublicRouteInventory and reconcileRoutes
  // used to sit OUTSIDE this try. Both throw plain Errors, and an unhandled
  // top-level-await rejection exits 1 — measured, not assumed — so a run that
  // could not measure reported as "the contract is violated". Reachable in
  // practice: SOURCE_FLOORS counts array LENGTH, so a source carrying an
  // empty-string record clears the floor and then throws inside the builder.
  // Everything that can throw now returns 2 through one path.
  try {
    // The manifest and the sitemap are read first: both are cheap, and both are
    // the inputs most likely to be absent or truncated.
    routeOutputIndex = readManifest(opts);
    if (routeOutputIndex.size < MANIFEST_ENTRY_FLOOR) {
      throw new UsageError(
        `manifest holds ${routeOutputIndex.size} routes, below MANIFEST_ENTRY_FLOOR ${MANIFEST_ENTRY_FLOOR} — refusing to reconcile against a partial manifest`,
      );
    }

    sitemap = await readSitemap(opts);
    if (sitemap.routes.length < LIVE_SITEMAP_FLOOR) {
      throw new UsageError(
        `sitemap ${sitemap.source} holds ${sitemap.routes.length} routes, below LIVE_SITEMAP_FLOOR ${LIVE_SITEMAP_FLOOR} — refusing to read a truncated sitemap as mass absence`,
      );
    }

    // getPublicCrewCodes throws when the sibling ekosistem checkout is missing,
    // but the review and blog readers return EMPTY. A resolved promise is
    // therefore not proof the sources were read — the floors are.
    const sources = await loadSources();
    for (const [key, floor] of Object.entries(SOURCE_FLOORS)) {
      const count = sources[key]?.length ?? 0;
      if (count < floor) {
        throw new UsageError(
          `source ${key} yielded ${count}, below SOURCE_FLOORS ${floor} — the ekosistem read is incomplete`,
        );
      }
    }

    const inventory = buildPublicRouteInventory(sources, {
      generatedAt: new Date().toISOString(),
    });

    report = reconcileRoutes({
      inventory: inventory.routes,
      sitemapRoutes: sitemap.routes,
      sitemapDuplicates: sitemap.duplicates,
      routeOutputIndex,
      generatedAt: new Date().toISOString(),
    });

    if (!opts.quiet) {
      console.log(`inventory:   ${inventory.routes.length} routes (local contract)`);
      console.log(`sitemap:     ${sitemap.routes.length} routes (${sitemap.source})`);
      console.log(`manifest:    ${routeOutputIndex.size} routes (${opts.manifest})`);
    }
  } catch (error) {
    if (error instanceof UsageError) {
      console.error(`${error.message} — refusing to run`);
      return 2;
    }
    // parseSitemapUrls and parseRouteOutputIndex throw plain Errors on malformed
    // input. That is still "the measurement did not happen", not "the contract
    // is violated", so it exits 2 with the parser's own message.
    console.error(`${error.message} — refusing to run`);
    return 2;
  }

  // ------------------------------------------------------------- reporting
  if (!opts.quiet) {
    console.log(summarizeReconciliation(report));
  }

  const notable = report.routes.filter((r) => r.status !== "PASS");
  if (notable.length > 0 && !opts.quiet) {
    console.log("");
    for (const row of notable) {
      console.log(`${row.status.padEnd(4)} ${row.route}  ${row.classification}`);
      console.log(`       ${CLASSIFICATIONS[row.classification].reason}`);
    }
  }

  // 2026-09-07, adversarial review: duplicates were collected, threaded through
  // the report, and printed in the human summary ONLY — so a production sitemap
  // publishing the same <loc> twice exited 0, and --quiet hid it completely.
  // T01 treats a route claimed twice as a violation
  // (validate-public-route-contract.mjs:245); observing the same defect in
  // production and shrugging is worse, not better. It fails here too, and the
  // message is written to stderr so --quiet cannot swallow it.
  const duplicates = report.sitemapDuplicates;
  if (duplicates.length > 0) {
    console.error(
      `duplicate <loc> in the published sitemap: ${duplicates.join(", ")}`,
    );
  }

  const failed =
    report.counts.fail > 0 ||
    duplicates.length > 0 ||
    (opts.failOnWarn && report.counts.warn > 0);
  let code = failed ? 1 : 0;

  if (failed) {
    console.error(
      `FAILED: ${report.counts.fail} fail${
        duplicates.length > 0 ? `, ${duplicates.length} duplicate <loc>` : ""
      }${opts.failOnWarn ? `, ${report.counts.warn} warn (--fail-on-warn)` : ""}`,
    );
  } else {
    console.log(
      `OK: ${report.counts.total} routes reconciled, 0 failures${
        report.counts.warn > 0 ? `, ${report.counts.warn} warning(s)` : ""
      }`,
    );
  }

  // Written AFTER the verdict, and a write failure only overrides a CLEAN run.
  // Telling a caller "you invoked me wrong" about a run whose own summary said
  // "3 fail" is worse than losing the file. Same ordering as verify-live.
  for (const [flag, value, render] of [
    ["--json", opts.json, () => JSON.stringify(report, null, 2) + "\n"],
    ["--csv", opts.csv, () => reconciliationToCsv(report)],
  ]) {
    if (!value) continue;
    try {
      writeFileSync(value, render());
      if (!opts.quiet) console.log(`${flag} written to ${value}`);
    } catch (error) {
      console.error(`cannot write ${flag} ${value}: ${error.message}`);
      if (code === 0) code = 2;
    }
  }

  return code;
}

// fileURLToPath, not new URL(...).pathname: on Win32 the latter yields
// "/D:/jvto-web/..." which never equals the resolved argv path, so the guard
// silently never fires and the script exits 0 having validated nothing.
// The `process.argv[1] &&` guard is not decoration and is not optional: node -e
// and some embeddings leave argv[1] undefined, and path.resolve(undefined)
// throws ERR_INVALID_ARG_TYPE at module load. T01's script carries it
// (validate-public-route-contract.mjs:300); this one had dropped it.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  // process.exitCode, never process.exit(), on a path that has done a fetch:
  // the libuv UV_HANDLE_CLOSING assertion turns a clean run into exit 127.
  process.exitCode = await main(process.argv.slice(2));
}
