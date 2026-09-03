#!/usr/bin/env node
/**
 * verify-live.mjs — assert the rendered head of live routes. Pure Node ESM, zero dependencies.
 *
 * Usage:
 *   node scripts/verify-live.mjs --sitemap                    # every URL in the live sitemap
 *   node scripts/verify-live.mjs --routes routes.txt          # one path or URL per line
 *   echo /contact | node scripts/verify-live.mjs --routes -   # from stdin
 *   node scripts/verify-live.mjs --sitemap --base http://127.0.0.1:3123
 *
 * Options:
 *   --base <url>         origin to fetch (default $NEXT_PUBLIC_SITE_URL, else production)
 *   --sitemap            take the route list from <base>/sitemap.xml
 *   --routes <file|->    take the route list from a file, or stdin with "-"
 *   --concurrency <n>    parallel fetches (default 6)
 *   --limit <n>          check only the first n routes — for spot checks, never for closure
 *   --json <file>        write the full per-route result set
 *   --quiet              suppress the per-route PASS lines; failures still print
 *
 * Exits 1 if any route fails a check, 0 otherwise. Warnings never change the exit code.
 *
 * WHY THIS EXISTS, and why it fetches instead of reading files: CLAUDE.md Rule 8.
 * Routes marked `ƒ (Dynamic)` in the build output have no file under .next to read.
 * On 2026-09-03 the build produced 106 static pages against a 302-URL sitemap, and
 * /why-jvto/reviews/[id] is dynamic — a file-based check would have silently skipped
 * the 228 pages carrying most of the og:url defect, and reported nothing as success.
 *
 * Rule 9 is the other half: a fix is closed by re-measuring at the scope the defect
 * was found. That is what `--sitemap` is for — it is the whole population, not a sample.
 *
 * LIMITS, stated rather than discovered later:
 *   - Reads the server-rendered HTML only. Anything a client component injects after
 *     hydration is invisible here, which is correct for SEO but not a general DOM check.
 *   - Regex-scrapes <head>. Fine because Next.js emits these tags plainly; it is not
 *     an HTML parser and would not survive tags split across attributes oddly.
 *   - Does not follow redirects silently: a redirected route is reported, because a
 *     route that moved is itself a finding when it came from the sitemap.
 */

import { readFileSync, writeFileSync } from "node:fs";

const DEFAULT_BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

// ---------------------------------------------------------------- arguments

// More parallel sockets than this against one origin stops being a measurement
// and starts being a load test. The full 302-route sweep takes ~17s at the
// default of 6, so the ceiling exists to bound the damage of a typo, not to
// serve any real workload.
const MAX_CONCURRENCY = 64;

const wholeNumber = (min, max) => (n) =>
  Number.isInteger(n) && n >= min && (max === undefined || n <= max);

// A base has to be an origin and nothing more. `https://site/blog` parsed fine
// and satisfied a protocol-only check, after which every target became
// /blog/<route> and the run reported non-200s and exited 1 — an invalid argument
// wearing the exit code that means the site is broken. Measured 2026-09-03.
// new URL("localhost:3123") also parses, taking "localhost:" as the scheme, so
// the protocol test is load-bearing too.
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

// Strip trailing slashes BEFORE validating, not after. bareOrigin requires
// pathname === "/", so `https://site//` was refused while the normalizer two
// steps later existed precisely to accept it — the guard and the normalizer
// disagreed, and `https://site/` passed only by luck of parsing to "/".
// Running it as the flag's coerce puts it ahead of validation on the CLI path
// too, which a normalizer placed after the loop would have missed.
const normalizeBase = (v) => v.replace(/\/+$/, "");

// One table, one loop, one error path. Every flag declares how to read its value
// and what counts as valid, because the previous shape — a hand-written block per
// flag — guaranteed the omission it produced: --limit went unguarded while
// --concurrency got a guard, and when both existed they disagreed, one testing
// Number.isFinite and the other Number.isInteger. `--concurrency 1e10` walked
// through that gap into Array.from({ length: 1e10 }) and an unhandled
// RangeError at exit 1. A new flag added here cannot skip validation by being
// forgotten; it can only skip it by declaring none.
const FLAGS = {
  "--sitemap": { boolean: true, key: "sitemap" },
  "--quiet": { boolean: true, key: "quiet" },
  "--base": {
    key: "base",
    coerce: normalizeBase,
    validate: bareOrigin,
    expected: BASE_EXPECTED,
  },
  "--routes": { key: "routes" },
  "--json": { key: "json" },
  "--concurrency": {
    key: "concurrency",
    coerce: Number,
    validate: wholeNumber(1, MAX_CONCURRENCY),
    expected: `a whole number from 1 to ${MAX_CONCURRENCY}`,
  },
  "--limit": {
    key: "limit",
    coerce: Number,
    validate: wholeNumber(1),
    expected: "a whole number >= 1",
  },
};

const refuse = (message) => {
  console.error(`${message} — refusing to run`);
  process.exit(2);
};

function parseArgs(argv) {
  const opts = {
    base: DEFAULT_BASE,
    sitemap: false,
    routes: null,
    concurrency: 6,
    limit: 0,
    json: null,
    quiet: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    // Object.hasOwn, not a bare lookup: FLAGS is an object literal, so
    // FLAGS["toString"] resolves Object.prototype.toString — truthy, with no
    // `key` — and `toString foo` sailed past the unknown-argument guard, wrote
    // opts[undefined] and exited 0. The else-if chain this table replaced used
    // strict equality and rejected it. Measured 2026-09-03.
    const spec = Object.hasOwn(FLAGS, flag) ? FLAGS[flag] : undefined;
    if (!spec) refuse(`unknown argument: ${flag}`);
    if (spec.boolean) {
      opts[spec.key] = true;
      continue;
    }
    // A missing value used to become `undefined`: --base threw a TypeError and
    // exited 1, the code that means "checks failed", while --routes and --json
    // were swallowed. An empty string did the same. A lone "-" is a real value
    // (stdin for --routes), so only "--" prefixes count as a missing value.
    const raw = argv[i + 1];
    if (raw === undefined || raw === "" || raw.startsWith("--")) {
      refuse(`${flag} needs a value`);
    }
    i += 1;
    const parsed = spec.coerce ? spec.coerce(raw) : raw;
    if (spec.validate && !spec.validate(parsed)) {
      refuse(`${flag} must be ${spec.expected}, got ${JSON.stringify(raw)}`);
    }
    opts[spec.key] = parsed;
  }
  if (!opts.sitemap && !opts.routes) {
    refuse("nothing to check: pass --sitemap or --routes <file|->");
  }
  // Both sources of routes were accepted together and --routes was then dropped
  // without a word, so a curated list could be silently replaced by a 302-URL
  // sitemap sweep. Say which one won.
  if (opts.sitemap && opts.routes) {
    console.warn("--sitemap and --routes both given; using the sitemap and ignoring --routes");
    opts.routes = null;
  }
  // The default base comes from the environment, so it has to clear the same bar
  // as a supplied one; the loop above only sees --base when it is passed.
  opts.base = normalizeBase(opts.base);
  if (!bareOrigin(opts.base)) {
    refuse(
      `base must be ${BASE_EXPECTED}, got ${JSON.stringify(opts.base)} (from ${
        process.env.NEXT_PUBLIC_SITE_URL ? "NEXT_PUBLIC_SITE_URL" : "the built-in default"
      })`,
    );
  }
  return opts;
}

// ------------------------------------------------------------- route lists

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

/** Thrown for conditions that must abort with code 2 rather than report a pass. */
class UsageError extends Error {}

async function loadRoutes(opts) {
  if (opts.sitemap) {
    const res = await get(`${opts.base}/sitemap.xml`);
    if (!res.ok) {
      throw new UsageError(
        `sitemap fetch failed: HTTP ${res.status} at ${opts.base}/sitemap.xml`,
      );
    }
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (locs.length === 0) {
      // A sitemap that parses to nothing is the silent-zero failure Rule 8 warns
      // about: it would report "0 failures" and look like a pass.
      throw new UsageError("sitemap contained zero <loc> entries — refusing to report a pass");
    }
    return locs;
  }
  const raw =
    opts.routes === "-" ? await readStdin() : readFileSync(opts.routes, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  if (lines.length === 0) {
    throw new UsageError("route list was empty — refusing to report a pass");
  }
  return lines;
}

/**
 * All fetching goes through here for one reason: `connection: close`.
 * With keep-alive left on, undici holds sockets open past the last response,
 * and calling process.exit() while they are still closing aborts the process on
 * Windows — `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` in
 * uv/src/win/async.c, surfacing to the shell as exit code 127. Measured
 * 2026-09-03: three of four input modes returned 127 regardless of whether the
 * checks passed or failed, which would make this script useless in CI, since CI
 * reads nothing but the exit code. Closing each connection, and setting
 * process.exitCode instead of calling process.exit(), removes the race.
 */
const get = (url, init = {}) =>
  fetch(url, {
    ...init,
    headers: { "user-agent": "jvto-verify-live", connection: "close", ...(init.headers ?? {}) },
  });

// ------------------------------------------------------------- extraction

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&");

const metaByName = (html, name) => {
  const re = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*name=["']${name}["']`,
    "i",
  );
  const m = re.exec(html) ?? alt.exec(html);
  return m ? decode(m[1]) : null;
};

const metaByProperty = (html, property) => {
  const re = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*property=["']${property}["']`,
    "i",
  );
  const m = re.exec(html) ?? alt.exec(html);
  return m ? decode(m[1]) : null;
};

const linkByRel = (html, rel) => {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    if (new RegExp(`rel=["']${rel}["']`, "i").test(m[0])) {
      const href = /href=["']([^"']*)["']/i.exec(m[0]);
      if (href) return decode(href[1]);
    }
  }
  return null;
};

const normalizePath = (p) => {
  const stripped = p.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
};

// Compare canonical against og:url on the same footing the path check uses.
// Byte equality after a normalized path check meant a pair differing only by a
// trailing slash passed one test and failed the next, and got reported as
// "disagrees" though both name the same page. Origin and query still count, so a
// genuine mismatch is still caught.
const normalizeUrl = (u) => {
  const url = new URL(u);
  return `${url.origin}${normalizePath(url.pathname)}${url.search}`;
};

// ------------------------------------------------------------------ checks

function checkRoute(target, status, html) {
  const wantPath = normalizePath(new URL(target).pathname);
  const failures = [];
  const warnings = [];

  if (status !== 200) {
    failures.push(`HTTP ${status}`);
    return { failures, warnings, canonical: null, ogUrl: null, title: null, ldBlocks: 0 };
  }

  const canonical = linkByRel(html, "canonical");
  const ogUrl = metaByProperty(html, "og:url");
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "").trim();
  const description = metaByName(html, "description");

  // canonical
  if (!canonical) failures.push("canonical missing");
  else if (!/^https?:\/\//i.test(canonical)) failures.push(`canonical not absolute: ${canonical}`);
  else if (normalizePath(new URL(canonical).pathname) !== wantPath)
    failures.push(`canonical points elsewhere: ${canonical}`);

  // og:url — the defect this script was written for
  if (!ogUrl) failures.push("og:url missing");
  else if (!/^https?:\/\//i.test(ogUrl)) failures.push(`og:url not absolute: ${ogUrl}`);
  else if (normalizePath(new URL(ogUrl).pathname) !== wantPath)
    failures.push(`og:url points elsewhere: ${ogUrl}`);
  else if (canonical && /^https?:\/\//i.test(canonical) && normalizeUrl(ogUrl) !== normalizeUrl(canonical))
    failures.push(`og:url disagrees with canonical: ${ogUrl} vs ${canonical}`);

  // title
  if (!title) failures.push("title missing or empty");
  else if (title.length > TITLE_MAX) warnings.push(`title ${title.length} chars`);

  // description is a warning, never a failure: some routes legitimately omit it
  if (!description) warnings.push("no meta description");
  else if (description.length > DESCRIPTION_MAX)
    warnings.push(`description ${description.length} chars`);

  // JSON-LD
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  let parsed = 0;
  for (const b of blocks) {
    try {
      JSON.parse(b[1]);
      parsed++;
    } catch (e) {
      failures.push(`JSON-LD does not parse: ${String(e.message).slice(0, 60)}`);
    }
  }
  if (blocks.length === 0) failures.push("no JSON-LD block");

  return {
    failures,
    warnings,
    canonical,
    ogUrl,
    title,
    titleLength: title.length,
    descriptionLength: description ? description.length : 0,
    ldBlocks: blocks.length,
    ldParsed: parsed,
  };
}

// -------------------------------------------------------------------- run

const opts = parseArgs(process.argv.slice(2));

let routes;
try {
  routes = await loadRoutes(opts);
} catch (e) {
  // A UsageError means the invocation was wrong: a route list that is empty, a
  // sitemap that parsed to nothing. Anything else here is the site or the
  // network failing to answer — an unreachable base exited 2, telling CI "you
  // called me wrong" for the one condition that should read as "the site is
  // down". Usage stays 2; a site that will not answer is 1, the same code a
  // route failing its checks produces. Measured 2026-09-03.
  console.error(e instanceof UsageError ? e.message : String(e));
  process.exitCode = e instanceof UsageError ? 2 : 1;
  routes = null;
}

if (routes) await run(routes);

// Wrapped in a function only so the loader can bail out above without a
// top-level return, which ESM does not allow.
async function run(routeList) {
const routes = opts.limit > 0 ? routeList.slice(0, opts.limit) : routeList;

const targets = routes.map((r) =>
  /^https?:\/\//i.test(r) ? r : `${opts.base}${r.startsWith("/") ? r : `/${r}`}`,
);

const results = [];
let cursor = 0;

async function worker() {
  while (cursor < targets.length) {
    const target = targets[cursor++];
    try {
      const res = await get(target, { redirect: "manual" });
      const html = res.status === 200 ? await res.text() : "";
      results.push({ target, status: res.status, ...checkRoute(target, res.status, html) });
    } catch (e) {
      results.push({
        target,
        status: 0,
        failures: [`fetch failed: ${String(e.message ?? e).slice(0, 80)}`],
        warnings: [],
      });
    }
  }
}

const started = Date.now();
await Promise.all(
  Array.from({ length: Math.max(1, opts.concurrency) }, worker),
);
const elapsed = ((Date.now() - started) / 1000).toFixed(1);

results.sort((a, b) => a.target.localeCompare(b.target));

const failed = results.filter((r) => r.failures.length > 0);
const warned = results.filter((r) => r.failures.length === 0 && r.warnings.length > 0);

if (!opts.quiet) {
  for (const r of results.filter((x) => x.failures.length === 0)) {
    console.log(`PASS  ${new URL(r.target).pathname}`);
  }
}

for (const r of failed) {
  console.log(`FAIL  ${new URL(r.target).pathname}`);
  for (const f of r.failures) console.log(`        ${f}`);
}

// Warnings are grouped rather than interleaved so a clean run stays one screen.
if (warned.length) {
  console.log(`\nwarnings (do not affect exit code): ${warned.length} route(s)`);
  for (const r of warned.slice(0, 15)) {
    console.log(`  ${new URL(r.target).pathname} — ${r.warnings.join("; ")}`);
  }
  if (warned.length > 15) console.log(`  … ${warned.length - 15} more`);
}

// Group failures by kind so 253 identical defects read as one line, not 253.
// Classified against an explicit list rather than by splitting on the first
// colon, which turned "og:url points elsewhere" into a bucket called "og".
const KINDS = [
  [/^HTTP /, "non-200 response"],
  [/^fetch failed/, "fetch failed"],
  [/^canonical missing/, "canonical missing"],
  [/^canonical not absolute/, "canonical not absolute"],
  [/^canonical points elsewhere/, "canonical points elsewhere"],
  [/^og:url missing/, "og:url missing"],
  [/^og:url not absolute/, "og:url not absolute"],
  [/^og:url points elsewhere/, "og:url points elsewhere"],
  [/^og:url disagrees/, "og:url disagrees with canonical"],
  [/^title /, "title missing or empty"],
  [/^JSON-LD does not parse/, "JSON-LD does not parse"],
  [/^no JSON-LD block/, "no JSON-LD block"],
];
const classify = (msg) => KINDS.find(([re]) => re.test(msg))?.[1] ?? "other";

if (failed.length) {
  const byKind = new Map();
  for (const r of failed) {
    for (const f of r.failures) {
      const kind = classify(f);
      byKind.set(kind, (byKind.get(kind) ?? 0) + 1);
    }
  }
  console.log("\nfailures by kind:");
  for (const [kind, n] of [...byKind].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${kind}`);
  }
}

console.log(
  `\n${results.length} route(s) checked against ${opts.base} in ${elapsed}s — ` +
    `${results.length - failed.length} pass, ${failed.length} fail, ${warned.length} with warnings`,
);

// process.exitCode, never process.exit — see the note on `get()` above.
process.exitCode = failed.length > 0 ? 1 : 0;

if (opts.json) {
  // An unwritable destination threw ENOENT out of here after every fetch had
  // finished, and the process died at exit 127 — no summary, no usable code.
  // A path that does not exist is a bad argument (2); anything else that stops
  // the write is a real failure (1). Set after the exit code above so a write
  // problem overrides a clean run rather than being overwritten by it.
  try {
    writeFileSync(opts.json, JSON.stringify(results, null, 2));
    console.log(`full results written to ${opts.json}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`--json path is not writable: ${err.path} — refusing to report a pass`);
      process.exitCode = 2;
    } else {
      console.error(`could not write ${opts.json}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}
}
