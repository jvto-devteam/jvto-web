// src/lib/ecosystemContent/tourSpineFaq.ts
//
// Fetches the compiled tour-detail FAQ spine from jvto-ekosistem
// (5-experience-engine/knowledge-feed/tour-spine-faq.feed-output.json) — 9 Q&A
// items whose answers are already resolved from canonical sources, each with a
// per-item source trace. Produced by jvto-ekosistem's
// scripts/generate-tour-spine-faq.mjs (backlog task T05A).
//
// Replaces the hardcoded spine in src/lib/tourFaqs.ts as part of T05B. That
// version carried a hardcoded NIB, an ISIC provider id, a BBKSDA circular
// number, doctor and hotel names, and an unweighted cross-platform rating mean
// that violated the 2026-08-15 owner decision (public rating is Google Maps
// only). None of those facts live in this repo any more.
//
// Same local-first / HTTP-fallback pattern as ecosystemContent/narrativeClaims.ts.
//
// NOTE ON THE EMPTY-ARRAY FALLBACK. This reader returns [] when the payload is
// unreachable, which means "not deployed yet" and "deployed but corrupt" look
// identical at build time. That is deliberate and load-bearing: the build must
// survive JVTO_EKOSYSTEM_CONTENT_ROOT="/nonexistent" with exit 0 (owner
// decision 2026-09-02), and G3 says absent data renders nothing rather than a
// placeholder. Do NOT add a build-time throw here. The thing that separates the
// two cases is the live sweep, `npm run validate:tour-faq-parity`, which asserts
// a non-zero FAQ count on every PDP against production.
//
// SHAPE corruption is a different matter and is NOT swallowed silently: both
// readers below require `items` to be an array. Without that check a payload
// carrying `items: {}` returns a non-iterable typed as an array, and the for-of
// in tourFaqResolution throws — turning a content problem into a failed build
// for all 17 PDPs. Returning null instead degrades to the same empty list as an
// unreachable payload, which is what the contract above promises.
import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_PATH =
  "5-experience-engine/knowledge-feed/tour-spine-faq.feed-output.json";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

/** One canonical fact substituted into an answer, with the record it came from. */
export interface TourSpineFaqFact {
  key: string;
  value: string | number;
  source_pointer: string;
}

export interface TourSpineFaqSourceTrace {
  generated_at: string;
  source_files: string[];
  fact_keys: string[];
}

/**
 * One compiled Q&A item. `answer` is already fully resolved — the generator
 * refuses to emit an unresolved placeholder — so this repo never substitutes
 * anything into it.
 *
 * `ui_link` is optional and genuinely absent on one of the nine live items
 * (tour-eco-responsible), so callers must not assume it.
 */
export interface TourSpineFaqItem {
  id: string;
  question: string;
  answer: string;
  applies_when: "always" | "ijen_only";
  facts: TourSpineFaqFact[];
  source_trace: TourSpineFaqSourceTrace;
  ui_meta?: string;
  ui_link?: string;
}

interface TourSpineFaqPayload {
  items?: TourSpineFaqItem[];
}

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

async function readLocal(): Promise<TourSpineFaqItem[] | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_PATH),
      "utf8",
    );
    const parsed = JSON.parse(raw) as TourSpineFaqPayload;
    return Array.isArray(parsed.items) ? parsed.items : null;
  } catch {
    return null;
  }
}

async function fetchRemote(): Promise<TourSpineFaqItem[] | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", SOURCE_PATH);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", "jvto-ekosistem-tour-spine-faq"],
      },
    });
    if (!response.ok) return null;

    // /api/file returns { content: "<json string>" }, so the body is parsed
    // twice. The typeof guard is what stops JSON.parse(undefined) throwing out
    // of this try on a shape change.
    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    const parsed = JSON.parse(body.content) as TourSpineFaqPayload;
    return Array.isArray(parsed.items) ? parsed.items : null;
  } catch {
    return null;
  }
}

/** The 9 compiled tour-spine FAQ items, or [] when the ekosistem record is unreachable. */
export async function getEcosystemTourSpineFaq(): Promise<TourSpineFaqItem[]> {
  return (await readLocal()) ?? (await fetchRemote()) ?? [];
}
