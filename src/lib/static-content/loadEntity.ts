/**
 * Entity loader (PACKAGE 01). Stable cross-page facts live once under
 * content/entities/ (AD-03). PACKAGE 02 adds strict per-entity schemas;
 * the base contract requires a valid lastReviewed date.
 */
import { readFileSync } from "node:fs";
import { defaultContentRoot, entityFilePath } from "./discoverContentFiles";
import { ContentFileError } from "./loadMarkdownPage";
import { EntityDocumentSchema, type EntityDocument } from "./schemas";

/** Load + validate an entity document by name. Returns null when absent. */
export function loadEntity(name: string, contentRoot = defaultContentRoot()): EntityDocument | null {
  const filePath = entityFilePath(name, contentRoot);
  if (!filePath) return null;

  let data: unknown;
  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new ContentFileError(filePath, `invalid JSON: ${(err as Error).message}`);
  }

  const result = EntityDocumentSchema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ContentFileError(filePath, `invalid entity — ${details}`);
  }
  return result.data;
}
