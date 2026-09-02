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
    const a = argv[i];
    if (a === "--sitemap") opts.sitemap = true;
    else if (a === "--quiet") opts.quiet = true;
    else if (a === "--base") opts.base = argv[++i];
    else if (a === "--routes") opts.routes = argv[++i];
    else if (a === "--json") opts.json = argv[++i];
    else if (a === "--concurrency") opts.concurrency = Number(argv[++i]);
    else if (a === "--limit") opts.limit = Number(argv[++i]);
    else {
      console.error(`unknown argument: ${a}`);
      process.exit(2);
    }
  }
  if (!opts.sitemap && !opts.routes) {
    console.error("nothing to check: pass --sitemap or --routes <file|->");
    process.exit(2);
  }
  opts.base = opts.base.replace(/\/+$/, "");
  return opts;
}

// ------------------------------------------------------------- route lists

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function loadRoutes(opts) {
  if (opts.sitemap) {
    const res = await fetch(`${opts.base}/sitemap.xml`);
    if (!res.ok) {
      console.error(`sitemap fetch failed: HTTP ${res.status} at ${opts.base}/sitemap.xml`);
      process.exit(2);
    }
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (locs.length === 0) {
      // A sitemap that parses to nothing is the silent-zero failure Rule 8 warns
      // about: it would report "0 failures" and look like a pass.
      console.error("sitemap contained zero <loc> entries — refusing to report a pass");
      process.exit(2);
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
    console.error("route list was empty — refusing to report a pass");
    process.exit(2);
  }
  return lines;
}

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
  else if (canonical && ogUrl !== canonical)
    failures.push(`og:url disagrees with canonical: ${ogUrl}`);

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
let routes = await loadRoutes(opts);
if (opts.limit > 0) routes = routes.slice(0, opts.limit);

const targets = routes.map((r) =>
  /^https?:\/\//i.test(r) ? r : `${opts.base}${r.startsWith("/") ? r : `/${r}`}`,
);

const results = [];
let cursor = 0;

async function worker() {
  while (cursor < targets.length) {
    const target = targets[cursor++];
    try {
      const res = await fetch(target, {
        redirect: "manual",
        headers: { "user-agent": "jvto-verify-live" },
      });
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

if (opts.json) {
  writeFileSync(opts.json, JSON.stringify(results, null, 2));
  console.log(`full results written to ${opts.json}`);
}

process.exit(failed.length > 0 ? 1 : 0);
