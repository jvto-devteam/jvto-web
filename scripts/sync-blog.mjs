#!/usr/bin/env node
// Sync blog output from llm-wiki → src/data/blog/.
// Pure ESM, no external deps. Idempotent. Manifest-gated. Published-only.
//
// Usage:
//   npm run sync:blog
//
// Source resolution:
//   - If process.env.LLM_WIKI_PATH is set, resolve from `${LLM_WIKI_PATH}/output/website/blog`.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/llm-wiki/output/website/blog`.
//
// Only posts with status === "published" in the source manifest are copied.
// Drafts never leave llm-wiki (preview lives in llm-wiki only). Stale dest
// posts no longer published are pruned so dest mirrors the published set.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/llm-wiki";

const wikiRoot = process.env.LLM_WIKI_PATH || DEFAULT_SRC;
const SRC_DIR = join(wikiRoot, "output", "website", "blog");
const DEST_DIR = join(REPO_ROOT, "src", "data", "blog");

function die(message) {
  console.error(`[sync-blog] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(SRC_DIR)) {
  die(
    `source dir not found: ${SRC_DIR}\n` +
      `set LLM_WIKI_PATH env to override (current: ${wikiRoot})`,
  );
}

const srcManifestPath = join(SRC_DIR, "_manifest.json");
if (!existsSync(srcManifestPath)) {
  die(`_manifest.json missing at ${srcManifestPath}`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(srcManifestPath, "utf8"));
} catch (err) {
  die(`_manifest.json parse failed: ${err.message}`);
}

const allPosts = Array.isArray(manifest?.posts) ? manifest.posts : [];
const published = allPosts.filter((p) => p && p.status === "published");

// Validate every published entry has a slug + a matching source .md file.
for (const post of published) {
  if (typeof post.slug !== "string" || post.slug.length === 0) {
    die(`published post missing slug: ${JSON.stringify(post)}`);
  }
  const srcMd = join(SRC_DIR, `${post.slug}.md`);
  if (!existsSync(srcMd)) {
    die(`published post '${post.slug}' has no source file: ${srcMd}`);
  }
}

mkdirSync(DEST_DIR, { recursive: true });

// Prune stale .md files in dest that are not in the published set.
const publishedSlugs = new Set(published.map((p) => p.slug));
const staleRemoved = [];
for (const file of readdirSync(DEST_DIR)) {
  if (!file.endsWith(".md")) continue;
  const slug = file.slice(0, -3);
  if (!publishedSlugs.has(slug)) {
    rmSync(join(DEST_DIR, file));
    staleRemoved.push(file);
  }
}

// Copy each published post .md.
for (const post of published) {
  copyFileSync(join(SRC_DIR, `${post.slug}.md`), join(DEST_DIR, `${post.slug}.md`));
}

// Write a dest manifest containing only published entries (sorted newest first).
// Output must be deterministic for the same source so the CI drift gate
// (git diff --exit-code) is stable — no timestamps generated at sync time.
const destManifest = {
  generated: manifest.generated ?? "",
  posts: [...published].sort((a, b) => String(b.date).localeCompare(String(a.date))),
};
writeFileSync(
  join(DEST_DIR, "_manifest.json"),
  JSON.stringify(destManifest, null, 2) + "\n",
);

console.log(
  `[sync-blog] synced ${published.length} published post(s)` +
    (staleRemoved.length ? `, pruned ${staleRemoved.length} stale` : "") +
    `\n  from: ${SRC_DIR}\n  to:   ${DEST_DIR}`,
);
