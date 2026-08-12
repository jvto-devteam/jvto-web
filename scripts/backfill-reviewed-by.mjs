#!/usr/bin/env node
// One-off (re-runnable) backfill: adds `reviewedBy: "JVTO Editorial"` to every
// content/pages/**/*.{md,json} file's meta block that doesn't already have one.
// Safe to re-run — it's a no-op for files that already carry the field.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// Simple recursive glob (no new dependency): walk content/pages for .md/.json files.
import { readdirSync, statSync } from "node:fs";

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out = out.concat(walk(full));
    else if (entry.endsWith(".md") || entry.endsWith(".json")) out.push(full);
  }
  return out;
}

const files = walk(path.join(process.cwd(), "content", "pages"));
let changed = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf8");

  if (file.endsWith(".json")) {
    const data = JSON.parse(raw);
    if (!data.meta) {
      console.warn(`SKIP (no meta object): ${file}`);
      continue;
    }
    if (data.meta.reviewedBy) continue; // already set
    data.meta.reviewedBy = "JVTO Editorial";
    writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    changed++;
    console.log(`updated: ${file}`);
  } else {
    // .md frontmatter — insert reviewedBy right after the lastReviewed line.
    if (/^reviewedBy:/m.test(raw)) continue; // already set
    if (!/^lastReviewed:.*$/m.test(raw)) {
      console.warn(`SKIP (no lastReviewed line found): ${file}`);
      continue;
    }
    const updated = raw.replace(
      /^(lastReviewed:.*)$/m,
      `$1\nreviewedBy: 'JVTO Editorial'`,
    );
    writeFileSync(file, updated);
    changed++;
    console.log(`updated: ${file}`);
  }
}

console.log(`\nDone. ${changed} file(s) updated, ${files.length} scanned.`);
