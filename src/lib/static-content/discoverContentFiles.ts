/**
 * Deterministic discovery of static-content files (PACKAGE 01).
 *
 * Walks `<contentRoot>/pages` and returns a SORTED list so build output and
 * validation order never depend on filesystem enumeration order. Returns []
 * when the content root (or pages dir) does not exist yet — the loader must
 * behave identically with and without a database, and identically before and
 * after `content/` is populated.
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const CONTENT_DIRNAME = "content";

/** Repo root = two levels up from src/lib (works from Next server + tsx scripts). */
export function defaultContentRoot(): string {
  return join(process.cwd(), CONTENT_DIRNAME);
}

export type DiscoveredFile = {
  /** Absolute path. */
  filePath: string;
  /** Path relative to the content root, POSIX-style (diagnostics). */
  relPath: string;
  ext: ".md" | ".json";
};

function walk(dir: string, out: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** All page files (.md/.json) under `<root>/pages`, sorted by relative path. */
export function discoverPageFiles(contentRoot = defaultContentRoot()): DiscoveredFile[] {
  const pagesDir = join(contentRoot, "pages");
  try {
    if (!statSync(pagesDir).isDirectory()) return [];
  } catch {
    return [];
  }
  return walk(pagesDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".json"))
    .map((filePath) => ({
      filePath,
      relPath: relative(contentRoot, filePath).split(sep).join("/"),
      ext: (filePath.endsWith(".md") ? ".md" : ".json") as ".md" | ".json",
    }))
    .sort((a, b) => (a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0));
}

/** Absolute path of a FAQ set file for a key, or null when absent. */
export function faqFilePath(key: string, contentRoot = defaultContentRoot()): string | null {
  const p = join(contentRoot, "faqs", `${key}.json`);
  try {
    return statSync(p).isFile() ? p : null;
  } catch {
    return null;
  }
}

/** Absolute path of an entity file, or null when absent. */
export function entityFilePath(name: string, contentRoot = defaultContentRoot()): string | null {
  const p = join(contentRoot, "entities", `${name}.json`);
  try {
    return statSync(p).isFile() ? p : null;
  } catch {
    return null;
  }
}

/** All FAQ set files, sorted (for validation). */
export function discoverFaqFiles(contentRoot = defaultContentRoot()): DiscoveredFile[] {
  const dir = join(contentRoot, "faqs");
  return walk(dir)
    .filter((f) => f.endsWith(".json"))
    .map((filePath) => ({
      filePath,
      relPath: relative(contentRoot, filePath).split(sep).join("/"),
      ext: ".json" as const,
    }))
    .sort((a, b) => (a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0));
}

/** All entity files, sorted (for validation). */
export function discoverEntityFiles(contentRoot = defaultContentRoot()): DiscoveredFile[] {
  const dir = join(contentRoot, "entities");
  return walk(dir)
    .filter((f) => f.endsWith(".json"))
    .map((filePath) => ({
      filePath,
      relPath: relative(contentRoot, filePath).split(sep).join("/"),
      ext: ".json" as const,
    }))
    .sort((a, b) => (a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0));
}
