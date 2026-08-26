#!/usr/bin/env node
/**
 * validate.mjs — static site-quality gates. Pure Node ESM, zero dependencies.
 *
 * Usage: node scripts/validate.mjs <schema|routes>
 *
 * `routes` reconciles next.config.ts redirects() and middleware.ts
 * (redirectMap + goneUrls) against the filesystem router. FAILS on a
 * redirect or gone source that still serves a page.tsx — the redirect is
 * unreachable, and one of the two is wrong.
 *
 * It also read src/lib/registry/pages.ts for canonicals and duplicate-intent
 * families until 2026-08-26. That registry was deleted on 2026-08-15 in
 * 3925805f and nothing imported it; those two checks are retired, not
 * paused.
 *
 * `schema` statically resolves the JSON-LD each (website) route emits:
 *   - inline @type literals in the route's page.tsx (incl. inline @graph)
 *   - nodes PageJsonLdCombined composes via src/lib/seo/jsonld/builders.ts
 *     (builder -> @type mapping is parsed from source, not hardcoded)
 * and exits 1 if any route emits >1 Organization-class node, >1 BreadcrumbList,
 * or >1 FAQPage, or a checked node is missing required fields.
 *
 * Static-analysis limits (documented, intentional):
 *   - Schema built in src/lib/schemas/build*Schemas.ts and passed via extraSchemas
 *     is out of scope here (counts only page-inline + PageJsonLdCombined nodes).
 *   - suppressCmsFaq passed as a dynamic expression (e.g. resolveFaqsForPage result)
 *     is treated as suppressed: the resolver contract guarantees at most one FAQ
 *     source fires. Literal false / absent prop counts the CMS FAQPage (worst case,
 *     since content.faq presence is runtime DB data).
 *   - Only TOP-LEVEL inline nodes count: standalone object literals and elements of
 *     a `@graph` array. Nested entity references (property values like `publisher:`,
 *     `recognizedBy:`, or elements of non-@graph arrays like `memberOf:`) are
 *     legitimate and excluded from singleton + required-field checks.
 *   - Any top-level @type literal in the page file counts as emitted, including dead
 *     schema variables that are never rendered — those are latent double-emitters
 *     and flagging them is desired.
 *   - Required-field checks are skipped for object literals using spread (`...`).
 */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEBSITE_DIR = path.join(ROOT, 'src', 'app', '(website)');
const BUILDERS_FILE = path.join(ROOT, 'src', 'lib', 'seo', 'jsonld', 'builders.ts');
const COMBINED_FILE = path.join(ROOT, 'src', 'components', 'seo', 'PageJsonLdCombined.tsx');

const ORG_CLASS = new Set(['Organization', 'TravelAgency', 'LocalBusiness']);
const SINGLETON_RULES = [
  { label: 'Organization', isMatch: (t) => ORG_CLASS.has(t) },
  { label: 'BreadcrumbList', isMatch: (t) => t === 'BreadcrumbList' },
  { label: 'FAQPage', isMatch: (t) => t === 'FAQPage' },
];
const REQUIRED_FIELDS = {
  Organization: ['name', 'url'],
  TravelAgency: ['name', 'url'],
  LocalBusiness: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  FAQPage: ['mainEntity'],
  WebSite: ['name', 'url'],
  WebPage: ['name'],
};

// ── generic helpers ───────────────────────────────────────────────────────────

function walkPageFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPageFiles(full, out);
    else if (entry.name === 'page.tsx') out.push(full);
  }
  return out;
}

function routeFromFile(file) {
  const rel = path.relative(WEBSITE_DIR, path.dirname(file));
  const segs = rel.split(path.sep).filter((s) => s && !/^\(.*\)$/.test(s));
  return '/' + segs.join('/');
}

/** Index of the `{` opening the object literal that contains position `idx`. */
function enclosingBlockStart(src, idx) {
  let depth = 0;
  for (let i = idx - 1; i >= 0; i--) {
    const c = src[i];
    if (c === '}') depth++;
    else if (c === '{') {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}

/**
 * Substring of the balanced block starting at `start`, skipping string literals
 * and comments (source data contains unbalanced brackets inside strings, e.g.
 * middleware goneUrls entries like "/destinations//span[").
 */
function scanBlock(src, start, open, close) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      i++;
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') i++;
        i++;
      }
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return src.slice(start);
}

/** Substring of the balanced `{...}` block starting at `start`. */
function blockAt(src, start) {
  return scanBlock(src, start, '{', '}');
}

/** Brace depth of position `idx` relative to `src` start. */
function braceDepthAt(src, idx) {
  let depth = 0;
  for (let i = 0; i < idx; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
  }
  return depth;
}

/**
 * 'top' = standalone literal (assignment/return/arg) or element of a `@graph` array;
 * 'nested' = property value or element of a non-@graph property array.
 */
function classifyInlineNode(src, blockStart) {
  let i = blockStart - 1;
  while (i >= 0 && /\s/.test(src[i])) i--;
  if (i < 0) return 'top';
  const p = src[i];
  if (p === ':') return 'nested';
  if (p === '[' || p === ',') {
    // locate the opener of the containing array (skipping balanced {}, [], ())
    let arr = -1;
    let brace = 0;
    let brack = 0;
    let paren = 0;
    for (let j = blockStart - 1; j >= 0; j--) {
      const c = src[j];
      if (c === '}') brace++;
      else if (c === '{') {
        if (brace === 0) return 'nested'; // directly inside an object literal
        brace--;
      } else if (c === ']') brack++;
      else if (c === '[') {
        if (brack === 0) {
          arr = j;
          break;
        }
        brack--;
      } else if (c === ')') paren++;
      else if (c === '(') {
        if (paren === 0) return 'top'; // function-arg literal
        paren--;
      }
    }
    if (arr === -1) return 'top';
    let k = arr - 1;
    while (k >= 0 && /\s/.test(src[k])) k--;
    if (src[k] === ':') {
      let e = k - 1;
      while (e >= 0 && /\s/.test(src[e])) e--;
      let s = e;
      while (s >= 0 && /[\w"'@-]/.test(src[s])) s--;
      const prop = src.slice(s + 1, e + 1).replace(/["']/g, '');
      return prop === '@graph' ? 'top' : 'nested';
    }
    return 'top'; // const x = [...] / extraSchemas={[...]}
  }
  return 'top'; // =, (, return, =>
}

function inlineTypeMatches(src) {
  const out = [];
  const re = /["']@type["']\s*:\s*["']([A-Za-z][\w]*)["']/g;
  let m;
  while ((m = re.exec(src))) out.push({ type: m[1], index: m.index });
  return out;
}

// ── builders.ts / PageJsonLdCombined.tsx resolution ───────────────────────────

/** Map exported builder function name -> emitted top-level @type (or null). */
function parseBuilderTypes(src) {
  const map = new Map();
  const fnRe = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
  let m;
  const starts = [];
  while ((m = fnRe.exec(src))) starts.push({ name: m[1], at: m.index, paramsAt: fnRe.lastIndex - 1 });
  for (let i = 0; i < starts.length; i++) {
    const { name, paramsAt } = starts[i];
    // body opens at the first `{` outside the parameter parens
    let parens = 0;
    let bodyStart = -1;
    for (let j = paramsAt; j < src.length; j++) {
      const c = src[j];
      if (c === '(') parens++;
      else if (c === ')') parens--;
      else if (c === '{' && parens === 0) {
        bodyStart = j;
        break;
      }
    }
    if (bodyStart === -1) continue;
    const body = blockAt(src, bodyStart);
    // emitted type = shallowest @type literal inside a returned object literal
    // (intermediate literals like FAQPage's nested Question sit in non-return
    // expressions or at greater depth)
    let best = null;
    const retRe = /\breturn\b/g;
    let r;
    while ((r = retRe.exec(body))) {
      let j = retRe.lastIndex;
      // skip whitespace and wrappers like `clean(` / `(`
      for (;;) {
        while (j < body.length && /\s/.test(body[j])) j++;
        const wrap = /^(\w+\s*\(|\()/.exec(body.slice(j, j + 20));
        if (wrap && body[j + wrap[0].length - 1] === '(') {
          j += wrap[0].length;
          continue;
        }
        break;
      }
      if (body[j] !== '{') continue;
      const retBlock = blockAt(body, j);
      for (const t of inlineTypeMatches(retBlock)) {
        const depth = braceDepthAt(retBlock, t.index);
        if (!best || depth < best.depth) best = { type: t.type, depth };
      }
      if (best) break;
    }
    map.set(name, best ? best.type : null);
  }
  return map;
}

/** Which builders PageJsonLdCombined composes, and which one suppressCmsFaq gates. */
function parseCombinedComposition(src, builderTypes) {
  const used = new Set();
  const callRe = /\b(build\w+)\s*\(/g;
  let m;
  while ((m = callRe.exec(src))) used.add(m[1]);
  const gateMatch = src.match(/suppressCmsFaq\s*\?\s*null\s*:\s*(build\w+)/);
  const gatedBuilder = gateMatch ? gateMatch[1] : null;
  const baseTypes = [];
  for (const name of used) {
    if (name === gatedBuilder) continue;
    const type = builderTypes.get(name);
    if (type) baseTypes.push({ builder: name, type });
  }
  const gatedType = gatedBuilder ? builderTypes.get(gatedBuilder) : null;
  return { baseTypes, gatedBuilder, gatedType };
}

// ── per-route analysis ────────────────────────────────────────────────────────

function suppressState(src) {
  const tagStart = src.indexOf('<PageJsonLdCombined');
  const tagEnd = tagStart >= 0 ? src.indexOf('/>', tagStart) : -1;
  const tagSrc = tagStart >= 0 && tagEnd >= 0 ? src.slice(tagStart, tagEnd + 2) : src;
  const m = tagSrc.match(/suppressCmsFaq\s*=\s*\{([\s\S]*?)\}/);
  if (m) {
    const v = m[1].trim();
    if (v === 'true') return 'suppressed';
    if (v === 'false') return 'unsuppressed';
    return 'dynamic'; // resolver contract: treat as suppressed
  }
  if (/\bsuppressCmsFaq\b(?!\s*=)/.test(tagSrc)) return 'suppressed'; // bare prop
  return 'unsuppressed';
}

function analyzeRoute(file, composition) {
  const src = readFileSync(file, 'utf8');
  const route = routeFromFile(file);
  const usesCombined = /<PageJsonLdCombined\b/.test(src);
  const suppress = usesCombined ? suppressState(src) : 'unsuppressed';

  // node list: { type, origin, blockSrc|null } — top-level inline nodes only
  const nodes = [];
  for (const t of inlineTypeMatches(src)) {
    const start = enclosingBlockStart(src, t.index);
    if (start >= 0 && classifyInlineNode(src, start) === 'nested') continue;
    const line = src.slice(0, t.index).split('\n').length;
    nodes.push({
      type: t.type,
      origin: `inline page.tsx:${line}`,
      block: start >= 0 ? blockAt(src, start) : null,
    });
  }
  if (usesCombined) {
    for (const { builder, type } of composition.baseTypes) {
      nodes.push({ type, origin: `PageJsonLdCombined → ${builder}()`, block: null });
    }
    if (composition.gatedType && (suppress === 'unsuppressed')) {
      nodes.push({
        type: composition.gatedType,
        origin: `PageJsonLdCombined → ${composition.gatedBuilder}() (CMS FAQ, suppressCmsFaq not set)`,
        block: null,
      });
    }
  }

  const violations = [];

  for (const rule of SINGLETON_RULES) {
    const hits = nodes.filter((n) => rule.isMatch(n.type));
    if (hits.length > 1) {
      violations.push(
        `${rule.label} emitted ${hits.length}× — ${hits
          .map((h) => `${h.type} (${h.origin})`)
          .join(' + ')}`,
      );
    }
  }

  for (const n of nodes) {
    const required = REQUIRED_FIELDS[n.type];
    if (!required || !n.block) continue; // builder-composed nodes checked once globally
    if (n.block.includes('...')) continue; // spread → fields not statically resolvable
    const missing = required.filter(
      (f) => !new RegExp(`["']?\\b${f}\\b["']?\\s*[:,}]`).test(n.block), // `:` or shorthand
    );
    if (missing.length) {
      violations.push(`${n.type} (inline) missing required field(s): ${missing.join(', ')}`);
    }
  }

  return { route, violations, nodeCount: nodes.length, suppress, usesCombined };
}

/** One-time sanity check that composed builders emit their required fields. */
function checkBuilderRequiredFields(buildersSrc, composition) {
  const problems = [];
  const all = [...composition.baseTypes];
  if (composition.gatedBuilder && composition.gatedType) {
    all.push({ builder: composition.gatedBuilder, type: composition.gatedType });
  }
  for (const { builder, type } of all) {
    const required = REQUIRED_FIELDS[type];
    if (!required) continue;
    const fnIdx = buildersSrc.indexOf(`function ${builder}`);
    if (fnIdx === -1) continue;
    const body = blockAt(buildersSrc, buildersSrc.indexOf('{', fnIdx));
    const missing = required.filter(
      (f) => !new RegExp(`["']?\\b${f}\\b["']?\\s*[:,}]`).test(body), // `:` or shorthand
    );
    if (missing.length) {
      problems.push(`builders.ts ${builder}() (${type}) missing required field(s): ${missing.join(', ')}`);
    }
  }
  return problems;
}

// ── subcommand: schema ────────────────────────────────────────────────────────

function runSchema() {
  const buildersSrc = readFileSync(BUILDERS_FILE, 'utf8');
  const combinedSrc = readFileSync(COMBINED_FILE, 'utf8');
  const builderTypes = parseBuilderTypes(buildersSrc);
  const composition = parseCombinedComposition(combinedSrc, builderTypes);

  console.log(
    `[schema] PageJsonLdCombined composes: ${composition.baseTypes
      .map((b) => b.type)
      .join(', ')}` +
      (composition.gatedType
        ? ` + ${composition.gatedType} (gated by suppressCmsFaq)`
        : ''),
  );

  const builderProblems = checkBuilderRequiredFields(buildersSrc, composition);
  const pageFiles = walkPageFiles(WEBSITE_DIR).sort();
  const results = pageFiles.map((f) => analyzeRoute(f, composition));
  const failing = results.filter((r) => r.violations.length > 0);

  for (const r of results) {
    if (!r.violations.length) continue;
    console.log(`\n✗ ${r.route}`);
    for (const v of r.violations) console.log(`    ${v}`);
  }
  for (const p of builderProblems) console.log(`\n✗ ${p}`);

  const ok = results.length - failing.length;
  console.log(
    `\n[schema] ${results.length} routes checked — ${ok} ok, ${failing.length} failing, ` +
      `${builderProblems.length} builder problem(s)`,
  );

  if (failing.length || builderProblems.length) {
    process.exitCode = 1;
  } else {
    console.log('[schema] PASS');
  }
}

// ── subcommand: routes ────────────────────────────────────────────────────────

const NEXT_CONFIG_FILE = path.join(ROOT, 'next.config.ts');
const MIDDLEWARE_FILE = path.join(ROOT, 'src', 'middleware.ts');

/** Substring of the balanced `[...]` block starting at `start`. */
function bracketBlockAt(src, start) {
  return scanBlock(src, start, '[', ']');
}

/** Redirect/gone sources from next.config.ts and middleware.ts, with layer labels. */
function parseRedirectSources() {
  const sources = [];
  const nextSrc = readFileSync(NEXT_CONFIG_FILE, 'utf8');
  const redirectsIdx = nextSrc.indexOf('async redirects()');
  if (redirectsIdx !== -1) {
    const body = blockAt(nextSrc, nextSrc.indexOf('{', redirectsIdx));
    const re = /source:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(body))) sources.push({ path: m[1], layer: 'next.config redirects()' });
  }
  let mwSrc = null;
  try {
    mwSrc = readFileSync(MIDDLEWARE_FILE, 'utf8');
  } catch {
    return sources; // no middleware — fine
  }
  const goneIdx = mwSrc.indexOf('goneUrls');
  if (goneIdx !== -1) {
    const arr = bracketBlockAt(mwSrc, mwSrc.indexOf('[', goneIdx));
    const re = /["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(arr))) sources.push({ path: m[1], layer: 'middleware goneUrls (410)' });
  }
  const mapIdx = mwSrc.indexOf('redirectMap');
  if (mapIdx !== -1) {
    const obj = blockAt(mwSrc, mwSrc.indexOf('{', mapIdx));
    const re = /["']([^"']+)["']\s*:/g;
    let m;
    while ((m = re.exec(obj))) sources.push({ path: m[1], layer: 'middleware redirectMap' });
  }
  return sources;
}

/**
 * Redirect tables against the filesystem router.
 *
 * This check used to reconcile src/lib/registry/pages.ts as well — canonicals
 * and duplicate-intent families. That registry was deleted on 2026-08-15 in
 * 3925805f, a dead-code sweep, and nothing under src/ has imported it since;
 * on the owner's decision those two jobs are retired rather than restored.
 *
 * What remains is the job that never needed the registry: a URL you redirect
 * away from that still serves a page.tsx is a conflict the filesystem and the
 * redirect tables prove between themselves. The redirect is unreachable, and
 * whichever of the two is wrong, one of them is.
 */
function runRoutes() {
  const fsRoutes = new Set(
    walkPageFiles(WEBSITE_DIR)
      .map(routeFromFile)
      .filter((r) => !r.includes('[')), // dynamic routes have no single source path
  );
  const redirectSources = parseRedirectSources();

  const failures = [];

  for (const { path: src, layer } of redirectSources) {
    if (!fsRoutes.has(src)) continue;
    failures.push(
      `${src} — redirect source (${layer}) still serves a page.tsx; the redirect is unreachable`,
    );
  }

  for (const f of failures) console.log(`✗ ${f}`);
  console.log(
    `\n[routes] ${fsRoutes.size} static routes on disk, ` +
      `${redirectSources.length} redirect/gone sources — ${failures.length} failure(s)`,
  );
  if (failures.length) process.exitCode = 1;
  else console.log('[routes] PASS');
}

// ── entrypoint ────────────────────────────────────────────────────────────────

const cmd = process.argv[2] ?? 'schema';
if (cmd === 'schema') {
  runSchema();
} else if (cmd === 'routes') {
  // src/lib/registry/pages.ts was deleted on 2026-08-15 in 3925805f, a
  // dead-code sweep — nothing under src/ imports the registry any more. This
  // check reconciles that registry against the filesystem router, next.config
  // redirects and middleware, so with the registry gone it has nothing to
  // reconcile and was failing with a raw ENOENT stack trace instead of saying
  // so. Skipping loudly is honest; crashing was not, and neither would be
  // deleting the check while the redirect coverage it also provided is
  // unreplaced. Tracked in jvto-ekosistem/state/goals.json as
  // validate-routes-registry-gone — restore the registry or retire the check.
  runRoutes();
} else {
  console.error(`Unknown subcommand "${cmd}". Usage: node scripts/validate.mjs <schema|routes>`);
  process.exitCode = 2;
}
