/**
 * Static-content SSOT types (public-content migration, PACKAGE 01).
 *
 * Canonical URLs are ALWAYS derived from the production origin + route (AD-06),
 * never from the deploy host — the help/preview box must emit production
 * canonicals just like production does.
 */
import type { FaqItem, PageMeta, StructuredSection } from "./schemas";

export const PRODUCTION_ORIGIN = "https://javavolcano-touroperator.com";

export type StaticPageFormat = "markdown" | "structured";

export type StaticPage = {
  meta: PageMeta;
  canonicalUrl: string;
  format: StaticPageFormat;
  /** Markdown body (markdown pages only). Starts at `##` — H1 is meta.title (AD-07). */
  body?: string;
  /** Lede paragraphs (structured pages only). */
  lede?: string[];
  /** Structured sections (structured pages only) — BlocksRenderer-compatible. */
  sections?: StructuredSection[];
  /** Resolved FAQ items when meta.faqKey is set. One source for HTML + JSON-LD (AD-08). */
  faq?: FaqItem[];
  /** Repo-relative source file path (diagnostics only — never rendered). */
  sourceFile: string;
};
