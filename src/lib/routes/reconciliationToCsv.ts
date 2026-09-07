/**
 * CSV serializer for the reconciliation report (T02, 2026-09-07).
 *
 * Pure, so the quoting rules are unit-testable. A naive fields.join(",") works
 * on today's data and breaks on the first value containing a comma, a quote or
 * a newline — and the breakage is silent: the file still opens, with the columns
 * shifted. No current field can contain one, which is exactly why nobody would
 * notice when one starts to.
 *
 * RFC4180: every field quoted unconditionally, embedded quotes doubled, CRLF
 * line endings. Quoting everything costs a few bytes and removes the entire
 * class of "was this field safe to leave bare".
 *
 * `failures` is joined with "|" rather than "," so that a multi-failure row
 * stays one field even for a reader that ignores the quoting.
 */
import type { ReconciliationReport } from "./reconcileRoutes";

export const RECONCILIATION_CSV_COLUMNS = [
  "route",
  "contractId",
  "group",
  "inPublicInventory",
  "inSitemap",
  "inRouteOutputIndex",
  "hasSchemaOutput",
  "hasWebsiteOutput",
  "sitemapExpected",
  "schemaOutputExpected",
  "websiteOutputExpected",
  "classification",
  "status",
  "failures",
] as const;

function quote(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function reconciliationToCsv(report: ReconciliationReport): string {
  const rows = [RECONCILIATION_CSV_COLUMNS.map(quote).join(",")];
  for (const r of report.routes) {
    rows.push(
      [
        r.route,
        r.contractId,
        r.group,
        r.inPublicInventory,
        r.inSitemap,
        r.inRouteOutputIndex,
        r.hasSchemaOutput,
        r.hasWebsiteOutput,
        r.sitemapExpected,
        r.schemaOutputExpected,
        r.websiteOutputExpected,
        r.classification,
        r.status,
        r.failures.join("|"),
      ]
        .map(quote)
        .join(","),
    );
  }
  return rows.join("\r\n") + "\r\n";
}
