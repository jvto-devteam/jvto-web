/**
 * FAQ set loader (PACKAGE 01). One FAQ object per key; the SAME items array
 * must feed both the visible FAQ component and the FAQPage JSON-LD (AD-08).
 */
import { readFileSync } from "node:fs";
import { defaultContentRoot, faqFilePath } from "./discoverContentFiles";
import { ContentFileError } from "./loadMarkdownPage";
import { FaqSetSchema, type FaqSet } from "./schemas";

/** Load + validate a FAQ set by key. Returns null when the key has no file. */
export function loadFaqSet(key: string, contentRoot = defaultContentRoot()): FaqSet | null {
  const filePath = faqFilePath(key, contentRoot);
  if (!filePath) return null;

  let data: unknown;
  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (err) {
    throw new ContentFileError(filePath, `invalid JSON: ${(err as Error).message}`);
  }

  const result = FaqSetSchema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new ContentFileError(filePath, `invalid FAQ set — ${details}`);
  }
  if (result.data.key !== key) {
    throw new ContentFileError(filePath, `FAQ key "${result.data.key}" does not match filename key "${key}"`);
  }
  return result.data;
}
