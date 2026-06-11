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

// Blog output is optional in llm-wiki. If the producer has no blog dir or
// manifest yet (e.g. fresh master before the first published post), treat it
// as "zero published posts" rather than failing — the loader/render handle an
// empty blog gracefully. A genuinely wrong LLM_WIKI_PATH is already caught by
// sync:packages / sync:trust, which run before this and require their sources.
const srcManifestPath = join(SRC_DIR, "_manifest.json");
const srcAvailable = existsSync(SRC_DIR) && existsSync(srcManifestPath);

let published = [];
if (srcAvailable) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(srcManifestPath, "utf8"));
  } catch (err) {
    die(`_manifest.json parse failed: ${err.message}`);
  }

  const allPosts = Array.isArray(manifest?.posts) ? manifest.posts : [];
  published = allPosts.filter((p) => p && p.status === "published");

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
} else {
  // Source absent — only safe to treat as zero posts if dest has no published posts yet.
  // If posts already exist in dest and source disappears (wrong path, transient failure),
  // pruning them would silently remove live pages. Fail loudly instead.
  const existingDestPosts = existsSync(DEST_DIR)
    ? readdirSync(DEST_DIR).filter((f) => f.endsWith(".md"))
    : [];
  if (existingDestPosts.length > 0) {
    die(
      `blog source missing (${SRC_DIR}) but ${existingDestPosts.length} published post(s) already exist in dest — refusing to prune. Check LLM_WIKI_PATH.`,
    );
  }
  console.log(`[sync-blog] no blog output in source (${SRC_DIR}) — writing empty manifest.`);
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
// (git diff --exit-code) is stable: no generated-at timestamp, and the shape is
// identical whether the source is absent (empty) or present with zero published.
const destManifest = {
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
