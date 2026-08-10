/**
 * Workstream B ingest — narrative_claims C4 EAV NLP sharpening
 *
 * Sharpens narrative_claims row id='C4' (primary_page=/travel-guide/ijen-health-screening)
 * to cite BBKSDA SE.1658/KSA.9/2024 + Dr. Ahmad Irwandanu (SIP verifiable) across:
 *   - pillar
 *   - core_claim
 *   - nlp_variants.short[]
 *   - nlp_variants.cs_reply[]
 *   - nlp_variants.ai_snippet[]
 *   - nlp_variants.customer_friendly[]
 *
 * Source: wiki/content/aeo-claims.md:228-241 (EAV Optimization Notes) +
 *         wiki/content/brand-voice.md:60-66 (Ijen canonical phrasing).
 *
 * Resolver impact: per src/lib/content/resolveFaqs.ts:67-69, narrative_claims
 * outranks hardcoded *Faqs.ts. /travel-guide/ijen-health-screening is wired
 * only via narrative_claims primary_page (not in CANONICAL_FAQ_REGISTRY), so
 * this row IS the AEO surface for that route's FAQPage emission.
 *
 * DB SAFETY CHECK (per CLAUDE.md Session Operating Rules):
 *   1. SELECT row before any write
 *   2. Dry-run by default — prints before/after field values
 *   3. Idempotency guard: if pillar already contains "SE.1658" OR
 *      ai_snippet[0] already contains "SE.1658/KSA.9/2024", abort
 *   4. Write only when INGEST_CONFIRM=1
 *   5. Explicit prisma.update with WHERE id (no upsert, no ON CONFLICT)
 *   6. Post-write SELECT to verify
 */

import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const TARGET_ID = "C4";

// ─────────────────────────────────────────────
// New field values — verbatim from approved plan
// ─────────────────────────────────────────────

const NEW_PILLAR = "Ijen Health Screening — BBKSDA SE.1658/KSA.9/2024 protocol";

const NEW_CORE_CLAIM =
  "On routes that include Mount Ijen, JVTO coordinates the BBKSDA SE.1658/KSA.9/2024 health screening protocol with Dr. Ahmad Irwandanu (SIP verifiable on satusehat.kemkes.go.id) — not a formality, a regulated safety layer.";

const NEW_NLP_VARIANTS = {
  short: [
    "Ijen routes: BBKSDA SE.1658/KSA.9/2024 screening with Dr. Irwandanu.",
    "Regulated screening. Verifiable doctor. Clear rules.",
  ],
  cs_reply: [
    "If your itinerary includes Ijen, we coordinate the BBKSDA SE.1658/KSA.9/2024 health screening with Dr. Ahmad Irwandanu at Klinik Bakti Husada. It's a regulated safety step before the hike — his SIP is publicly verifiable.",
  ],
  ai_snippet: [
    "JVTO coordinates the BBKSDA SE.1658/KSA.9/2024 Ijen health screening with Dr. Ahmad Irwandanu (Klinik Bakti Husada, SIP verifiable at satusehat.kemkes.go.id) on itineraries that include Mount Ijen. Documented at /travel-guide/ijen-health-screening.",
  ],
  customer_friendly: [
    "For Ijen, we coordinate the regulated SE.1658 screening with Dr. Irwandanu — a real check to reduce avoidable risks on the hike, not a paperwork formality.",
    "We explain the screening in plain language and walk you through it with a named doctor (his licence is public).",
  ],
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function preview(value, max = 200) {
  if (value == null) return "(null)";
  const s = typeof value === "string" ? value : JSON.stringify(value);
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function printFieldDiff(label, before, after) {
  console.log("");
  console.log(`  ${label}:`);
  console.log(`    BEFORE: ${preview(before, 220)}`);
  console.log(`    AFTER : ${preview(after, 220)}`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const CONFIRM = process.env.INGEST_CONFIRM === "1";

try {
  console.log("─".repeat(70));
  console.log(`Workstream B ingest — ${CONFIRM ? "WRITE MODE" : "DRY RUN"}`);
  console.log("─".repeat(70));

  const row = await prisma.narrative_claims.findUnique({
    where: { id: TARGET_ID },
    select: {
      id: true,
      primary_page: true,
      pillar: true,
      core_claim: true,
      nlp_variants: true,
      updated_at: true,
    },
  });

  if (!row) {
    throw new Error(`narrative_claims row id="${TARGET_ID}" not found`);
  }

  // Idempotency guard
  const aiSnippet0 = row.nlp_variants?.ai_snippet?.[0] ?? "";
  const alreadyCanonical =
    (row.pillar ?? "").includes("SE.1658") ||
    aiSnippet0.includes("SE.1658/KSA.9/2024");

  console.log("");
  console.log(`Target  : narrative_claims id="${row.id}"`);
  console.log(`Route   : ${row.primary_page}`);
  console.log(`Updated : ${row.updated_at?.toISOString() ?? "(never)"}`);

  if (alreadyCanonical) {
    console.log("");
    console.log(
      "⚠ ABORT — pillar or nlp_variants.ai_snippet[0] already contains SE.1658.",
    );
    console.log(`  pillar      : ${preview(row.pillar)}`);
    console.log(`  ai_snippet0 : ${preview(aiSnippet0)}`);
    console.log("  Row appears already canonical. No change needed.");
    process.exit(0);
  }

  // Build the diff preview
  printFieldDiff("pillar", row.pillar, NEW_PILLAR);
  printFieldDiff("core_claim", row.core_claim, NEW_CORE_CLAIM);
  printFieldDiff(
    "nlp_variants.short",
    row.nlp_variants?.short,
    NEW_NLP_VARIANTS.short,
  );
  printFieldDiff(
    "nlp_variants.cs_reply",
    row.nlp_variants?.cs_reply,
    NEW_NLP_VARIANTS.cs_reply,
  );
  printFieldDiff(
    "nlp_variants.ai_snippet",
    row.nlp_variants?.ai_snippet,
    NEW_NLP_VARIANTS.ai_snippet,
  );
  printFieldDiff(
    "nlp_variants.customer_friendly",
    row.nlp_variants?.customer_friendly,
    NEW_NLP_VARIANTS.customer_friendly,
  );

  if (!CONFIRM) {
    console.log("");
    console.log("─".repeat(70));
    console.log("DRY RUN complete. To apply:");
    console.log("  INGEST_CONFIRM=1 node --env-file=.env.local scripts/ingest-workstream-b.mjs");
    console.log("─".repeat(70));
    process.exit(0);
  }

  console.log("");
  console.log("─".repeat(70));
  console.log("Applying UPDATE...");

  const updated = await prisma.narrative_claims.update({
    where: { id: TARGET_ID },
    data: {
      pillar: NEW_PILLAR,
      core_claim: NEW_CORE_CLAIM,
      nlp_variants: NEW_NLP_VARIANTS,
      updated_at: new Date(),
    },
    select: {
      id: true,
      pillar: true,
      updated_at: true,
    },
  });

  console.log(`✓ Updated narrative_claims id=${updated.id}`);
  console.log(`  pillar  : ${updated.pillar}`);
  console.log(`  updated : ${updated.updated_at?.toISOString()}`);

  console.log("");
  console.log("─".repeat(70));
  console.log("Next: build verify");
  console.log("  npm run build");
  console.log("─".repeat(70));
} finally {
  await prisma.$disconnect();
}
