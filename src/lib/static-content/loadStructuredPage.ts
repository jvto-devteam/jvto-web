/**
 * Structured (JSON) page loader (PACKAGE 01). Validates against
 * StructuredPageSchema — the block union mirrors the current BlocksRenderer
 * (markdown | image | grid | crew_grid); no new block system (blueprint §5.2).
 */
import { readFileSync } from "node:fs";
import { ContentFileError } from "./loadMarkdownPage";
import { StructuredPageSchema, type StructuredPageDocument } from "./schemas";

export function loadStructuredPage(filePath: string): StructuredPageDocument {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (err) {
    throw new ContentFileError(filePath, `unreadable: ${(err as Error).message}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new ContentFileError(filePath, `invalid JSON: ${(err as Error).message}`);
  }

  const result = StructuredPageSchema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ContentFileError(filePath, `invalid structured page — ${details}`);
  }
  return result.data;
}
