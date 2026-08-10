/**
 * Markdown page loader (PACKAGE 01). Frontmatter via gray-matter; meta
 * validated with PageMetaSchema. The body is returned verbatim — rendering
 * stays with the existing MarkdownRenderer components (AD-05).
 */
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { CORE_SCHEMA, load } from "js-yaml";
import { PageMetaSchema, type PageMeta } from "./schemas";

/**
 * YAML 1.2 CORE schema: dates stay plain strings. The default YAML 1.1
 * timestamp tag would auto-parse `lastReviewed: 2026-08-04` into a JS Date —
 * and, worse, roll impossible dates (2026-13-45 → Feb 2027) into "valid" ones
 * before Zod ever sees them. Strings in, strict validation after.
 */
const MATTER_OPTIONS = {
  engines: {
    yaml: {
      parse: (src: string) => (load(src, { schema: CORE_SCHEMA }) ?? {}) as object,
      stringify: () => {
        throw new Error("static-content frontmatter stringify is not supported");
      },
    },
  },
} as const;

export type LoadedMarkdownPage = {
  meta: PageMeta;
  body: string;
};

export class ContentFileError extends Error {
  constructor(
    public readonly filePath: string,
    message: string,
  ) {
    super(`${filePath}: ${message}`);
    this.name = "ContentFileError";
  }
}

export function loadMarkdownPage(filePath: string): LoadedMarkdownPage {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (err) {
    throw new ContentFileError(filePath, `unreadable: ${(err as Error).message}`);
  }

  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(raw, MATTER_OPTIONS);
  } catch (err) {
    throw new ContentFileError(filePath, `frontmatter parse failed: ${(err as Error).message}`);
  }

  const result = PageMetaSchema.safeParse(parsed.data);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ContentFileError(filePath, `invalid frontmatter — ${details}`);
  }

  return { meta: result.data, body: parsed.content.trim() };
}
