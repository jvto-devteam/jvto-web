// Route-specific validation for the bespoke grids used by the Travel Guide folder pages
// that keep a custom layout (PACKAGE 04b). The shared content schema keeps grid `items` as
// loose objects, so each grid is validated against its real shape here — a malformed content
// edit then fails the build with a descriptive message instead of a runtime crash on the
// published page. Exported (not route-local) so the negative self-test can exercise them.
import { z } from "zod";

/** best-time-to-visit "season-cards" grid item. */
export const SeasonCardSchema = z.object({
  kind: z.enum(["dry", "wet"]),
  label: z.string().min(1),
  range: z.string().min(1),
  points: z.array(z.object({ positive: z.boolean(), text: z.string().min(1) })).min(1),
});
export type SeasonCard = z.infer<typeof SeasonCardSchema>;

/** best-time-to-visit "month-table" grid row. */
export const MonthRowSchema = z.object({
  month: z.string().min(1),
  bromo: z.string().min(1),
  ijen: z.string().min(1),
  tumpak: z.string().min(1),
  crowd: z.string().min(1),
  sweet: z.boolean(),
});
export type MonthRow = z.infer<typeof MonthRowSchema>;

/** police-escort-for-groups "key-facts" grid item. */
export const KeyFactSchema = z.object({ text: z.string().min(1) });
export type KeyFact = z.infer<typeof KeyFactSchema>;

/** faq "faq-list" grid item (one Q&A). */
export const FaqListItemSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) });
export type FaqListItem = z.infer<typeof FaqListItemSchema>;

/**
 * Validate a bespoke grid's items against a route-specific schema. Throws a descriptive
 * Error (naming the grid + the offending field path) when the content is malformed, so the
 * failure surfaces at build time rather than as an `undefined.map()` on the rendered page.
 */
export function parseGrid<T>(schema: z.ZodType<T>, items: unknown[], label: string): T[] {
  const parsed = z.array(schema).safeParse(items);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`travel-guide content: malformed "${label}" grid — ${detail}`);
  }
  return parsed.data;
}
