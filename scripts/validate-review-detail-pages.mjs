#!/usr/bin/env node
// Validates that /why-jvto/reviews/{id} detail pages actually render a
// Product-typed JSON-LD node.
//
// Why this exists (2026-08-20, whole-branch code review finding): the 217
// review-detail routes are deliberately NOT in sitemap.xml (see
// src/app/(website)/why-jvto/sitemap.data.ts — only the 5 hub sub-pages are
// listed), so scripts/validate-jsonld-schema.mjs — which derives its route
// list from the live sitemap.xml — never actually checks any of them and
// reports "0 violations" while blind to this entire route family. These URLs
// ARE externally advertised though: src/app/(api)/api/reviews-xml/route.ts
// emits a <review_url> entry for every review id in a Google review feed, so
// a broken detail page is externally visible even though it's invisible to
// every internal check. This script closes that gap.
//
// Reads the real reviews.json from the sibling ekosistem checkout using the
// same local-file-first convention as src/lib/ecosystemContent/reviews.ts
// (JVTO_EKOSYSTEM_CONTENT_ROOT env var, defaulting to ../jvto-ekosistem
// relative to cwd) — falls back to the remote /api/file endpoint the same
// way that file does, so this script also works from a checkout that
// doesn't have jvto-ekosistem cloned as a sibling.
//
// Usage: node scripts/validate-review-detail-pages.mjs [--base-url=https://...] [--sample=20|all]
//
// Sampling: by default this checks ALL review ids, not a subset. The check
// itself is just a GET + a JSON-LD regex/parse (no rendering, no auth), and
// at ~217 ids with modest concurrency this finishes in well under a minute —
// cheap enough that "sample a subset" would only be trading completeness for
// a speed win nobody needs. Pass --sample=N to only check the first N ids
// (e.g. for a fast smoke test) if that ever changes.

import { readFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = (
  process.argv.find((a) => a.startsWith("--base-url="))?.split("=")[1] ??
  process.env.GEO_AUDIT_BASE_URL ??
  "https://javavolcano-touroperator.com"
).replace(/\/$/, "");

const SAMPLE_ARG = process.argv.find((a) => a.startsWith("--sample="))?.split("=")[1] ?? "all";

const DEFAULT_ECOSYSTEM_BASE_URL = "https://ekosistem.javavolcano-touroperator.com";
const SOURCE_PATH =
  "1-knowledge-and-evidence-core/credentials-and-public-evidence/reviews.json";

function ecosystemContentRoot() {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocalReviews() {
  try {
    const raw = await readFile(path.join(ecosystemContentRoot(), SOURCE_PATH), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchRemoteReviews() {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);
    const response = await fetch(url);
    if (!response.ok) return null;
    const body = await response.json();
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content);
  } catch {
    return null;
  }
}

async function getReviewIds() {
  const file = (await readLocalReviews()) ?? (await fetchRemoteReviews());
  const reviews = Array.isArray(file?.reviews) ? file.reviews : [];
  return reviews.map((r) => r.id).filter((id) => Number.isFinite(id));
}

function typesOf(node) {
  const t = node?.["@type"];
  if (Array.isArray(t)) return t.filter((x) => typeof x === "string");
  return typeof t === "string" ? [t] : [];
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      blocks.push({ __parseError: e.message, __raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

function flattenNodes(blocks) {
  const nodes = [];
  for (const block of blocks) {
    if (block.__parseError) continue;
    if (Array.isArray(block?.["@graph"])) {
      nodes.push(...block["@graph"]);
    } else if (block && typeof block === "object") {
      nodes.push(block);
    }
  }
  return nodes;
}

async function validateReviewPage(id) {
  const route = `/why-jvto/reviews/${id}`;
  const url = `${BASE_URL}${route}`;

  let html;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      return { id, route, ok: false, detail: `HTTP ${res.status}` };
    }
    html = await res.text();
  } catch (e) {
    return { id, route, ok: false, detail: `fetch-error: ${e.message}` };
  }

  const blocks = extractJsonLdBlocks(html);
  const parseErrors = blocks.filter((b) => b.__parseError);
  if (parseErrors.length > 0) {
    return { id, route, ok: false, detail: `JSON-LD parse-error: ${parseErrors[0].__parseError}` };
  }

  const nodes = flattenNodes(blocks);
  const hasProduct = nodes.some((node) => typesOf(node).includes("Product"));
  if (!hasProduct) {
    return { id, route, ok: false, detail: "no Product-typed JSON-LD node found" };
  }

  return { id, route, ok: true };
}

async function main() {
  console.log(`Validating review-detail JSON-LD on ${BASE_URL} ...`);
  let ids = await getReviewIds();
  if (ids.length === 0) {
    console.error("[validate-review-detail-pages] Could not load any review ids from reviews.json (local or remote). Aborting.");
    process.exit(1);
  }

  if (SAMPLE_ARG !== "all") {
    const n = Number(SAMPLE_ARG);
    if (Number.isFinite(n) && n > 0) ids = ids.slice(0, n);
  }

  console.log(`${ids.length} review id(s) to check${SAMPLE_ARG !== "all" ? ` (--sample=${SAMPLE_ARG})` : " (all)"}`);

  const results = [];
  // Modest concurrency — enough to be fast, gentle enough not to look like a stress test.
  const CONCURRENCY = 10;
  let cursor = 0;
  async function worker() {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      results.push(await validateReviewPage(id));
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const failures = results.filter((r) => !r.ok);

  console.log(`\n${results.length} review page(s) checked.`);

  if (failures.length === 0) {
    console.log(`OK: all ${results.length} review-detail pages have a Product-typed JSON-LD node.`);
    return;
  }

  console.log(`\n${failures.length} review page(s) FAILED:\n`);
  for (const f of failures) {
    console.log(`  ${f.route} — ${f.detail}`);
  }
  console.log("");
  process.exitCode = 1;
}

main().catch((e) => {
  console.error("[validate-review-detail-pages]", e.message);
  process.exit(1);
});
