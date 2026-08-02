/**
 * Workstream C ingest — Guardian Archetype + Trust-Pillar Crew Mapping
 *
 * Prepends framing sections to content_pages.content.sections for two routes:
 *   /why-jvto/our-story   → guardian-archetype
 *   /why-jvto/our-team    → guardian-mindset + trust-pillar-crew-mapping
 *
 * Source (verbatim, owner-curated SSOT):
 *   e:/Users/JAVA VOLCANO/llm-wiki/wiki/content/copy-bank.md:93-99
 *   e:/Users/JAVA VOLCANO/llm-wiki/wiki/people/crew-registry.md:129-163
 *
 * Block strategy: single markdown block per section, GFM syntax.
 * Pull-quotes via `>` render as branded blockquote (left-border #9fce33, italic, light-green bg).
 * 7-row table via pipe syntax renders as branded table with hover state.
 *
 * DB SAFETY CHECK (per CLAUDE.md Session Operating Rules):
 *   1. SELECT current content before any write
 *   2. Dry-run by default — prints before/after section IDs + character counts
 *   3. Idempotency guard: if any of the new section IDs already exist, abort
 *   4. Write only when INGEST_CONFIRM=1
 *   5. No `ON CONFLICT DO UPDATE` — explicit prisma.update with WHERE id
 *
 * Archetype DB IDs sourced from wiki/people/crew-registry.md:159-163.
 * NOT verified against crew_members table — owner-curated SSOT.
 * If a name mismatches in the rendered table, re-check wiki + DB.
 */

import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// Section payloads — verbatim wiki SSOT
// ─────────────────────────────────────────────

const GUARDIAN_ARCHETYPE_SECTION = {
  id: "guardian-archetype",
  title: "The Guardian Framing",
  blocks: [
    {
      type: "markdown",
      body_md: [
        'JVTO\'s founder framing is **guardian** — not "authority", not "operator", not "expert". A protector who stands between guests and risk, not an enforcer of rules. The distinction matters because tourism in volcanic terrain attracts two kinds of operators: those drawn to the revenue, and those drawn to the responsibility. Our framing is the second.',
        "",
        "> Mr. Sam doesn't run tours because he likes the business. He runs them because someone with his training should be managing the safety gap — and no one else was.",
        "",
        "> The Tourist Police unit was built for Ijen Geopark. Mr. Sam was already there. The tours came later.",
        "",
        "This is why every page on this site cites SPRIN POLPAR, BBKSDA SE.1658, and Dr. Irwandanu's SIP rather than \"experienced team\" or \"passionate about Indonesia\". The credentials exist because the role exists. The tours are downstream.",
      ].join("\n"),
    },
  ],
};

const GUARDIAN_MINDSET_SECTION = {
  id: "guardian-mindset",
  title: "How To Read This Team Page",
  blocks: [
    {
      type: "markdown",
      body_md: [
        'Crew bios across the tourism industry default to "friendly", "knowledgeable", "passionate". Those words tell you nothing. JVTO frames the crew differently: as **protectors with specific training and operational accountability**, not as enjoyable company.',
        "",
        "> A JVTO guide doesn't just walk you up the crater. They're a HPWKI-registered member who completed BBKSDA-supervised SAR and first-aid training at Paltuding (May 2024). When Rendi held hands with guests on the steep crater descent, that's training, not personality.",
        "",
        'The framing principle: lead with competence, let warmth emerge from specifics. "Safety-first" alone is insufficient — cite the credential chain (KTA → HPWKI → BBKSDA) and let the named moments do the rest.',
      ].join("\n"),
    },
  ],
};

const TRUST_PILLAR_CREW_MAPPING_SECTION = {
  id: "trust-pillar-crew-mapping",
  title: "Which Crew Member Owns Which Trust Pillar",
  blocks: [
    {
      type: "markdown",
      body_md: [
        "JVTO publishes 7 trust pillars across the why-jvto, verify-jvto, and tour pages. Each pillar is anchored to a specific crew member (or set) whose lived experience and credentials carry the proof load. Use this as a reading key: when you see a pillar cited elsewhere on the site, this is who actually delivers it.",
        "",
        "| Trust Pillar | Primary crew | Key evidence |",
        "|---|---|---|",
        "| 1. Police-Led Safety (C1) | Mr. Sam (founder) | SPRIN POLPAR, Detik 2021 overnight deployment |",
        "| 2. Medical Precision (C4) | Dr. Irwandanu + all guides | BBKSDA SE.1658, SIP verifiable at Kemenkes |",
        "| 3. Local Territory Mastery (C2) | Gufron, Anjas, Rendi | KTA + geological + SAR expertise |",
        "| 4. Transparency & Documentation (C3, C5) | Yandi, Fredi | Review excerpts — briefings, punctuality |",
        "| 5. Guest Hospitality (C7) | Boy, Kiki, Taufik, Fauzi | Named in reviews, photography, warmth |",
        "| 6. Environmental Stewardship (C8) | All guides via INDECON | \"Local Boys\" policy, community employment |",
        "| 7. Credential Verification (C5, C9) | Whole crew via KTA chain | HPWKI AHU registry, BBKSDA training record |",
        "",
        "Below: the five archetype crew whose names appear most in reviews and on tour-page evidence callouts. The archetype label is shorthand for the role they play across the operational matrix.",
        "",
        "| Crew | KTA | Archetype | Defining evidence |",
        "|---|---|---|---|",
        "| Joyo | KTA-D-2024-011 (DB 73) | Precision Professional | *\"I drive fast, but always cleanly, smoothly, and safely.\"* |",
        "| Yandi | KTA-D-2024-003 (DB 1) | Senior Touring Specialist | 4.94/5.0 across 17 reviews. *\"Briefed us on what to expect.\"* |",
        "| Fredi | KTA-D-2024-005 (DB 7) | Reliability Anchor | *\"Always on time no matter what time of the day\"* — Pooja Prakash |",
        "| Gufron | KTA-G-2024-001 (DB 39) | Expert Guide | Geological + photography expertise. Divya_Stri Sep 2025 review |",
        "| Anjas | KTA-G-2024-006 (DB 3) | Youth/Creative | 4.91/5.0 average. Astrophotography. *\"Anjas was the highlight.\"* |",
      ].join("\n"),
    },
  ],
};

// ─────────────────────────────────────────────
// Route → new sections to prepend
// ─────────────────────────────────────────────

const INGEST_PLAN = [
  {
    route: "/why-jvto/our-story",
    newSections: [GUARDIAN_ARCHETYPE_SECTION],
  },
  {
    route: "/why-jvto/our-team",
    newSections: [GUARDIAN_MINDSET_SECTION, TRUST_PILLAR_CREW_MAPPING_SECTION],
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function sectionIds(sections) {
  return Array.isArray(sections) ? sections.map((s) => s?.id ?? "<no-id>") : [];
}

function bytesOf(obj) {
  return Buffer.byteLength(JSON.stringify(obj), "utf8");
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const CONFIRM = process.env.INGEST_CONFIRM === "1";

try {
  console.log("─".repeat(70));
  console.log(`Workstream C ingest — ${CONFIRM ? "WRITE MODE" : "DRY RUN"}`);
  console.log("─".repeat(70));

  const updates = [];

  for (const { route, newSections } of INGEST_PLAN) {
    const row = await prisma.content_pages.findFirst({
      where: { route, lang: "en", is_active: true },
      select: { id: true, route: true, content: true, updated_at: true },
    });

    if (!row) {
      throw new Error(`No active content_pages row for route="${route}" lang="en"`);
    }

    const existingContent = row.content ?? {};
    const existingSections = Array.isArray(existingContent.sections)
      ? existingContent.sections
      : [];
    const existingIds = new Set(sectionIds(existingSections));

    // Idempotency guard
    const collision = newSections.find((s) => existingIds.has(s.id));
    if (collision) {
      console.log("");
      console.log(`⚠ SKIP ${route} — section id "${collision.id}" already present.`);
      console.log(`  Existing IDs: ${[...existingIds].join(", ")}`);
      console.log(`  Re-run after manual removal of "${collision.id}" if you intend to replace.`);
      continue;
    }

    const newContent = {
      ...existingContent,
      sections: [...newSections, ...existingSections],
    };

    console.log("");
    console.log(`Route   : ${route}`);
    console.log(`Row ID  : ${row.id}`);
    console.log(`Before  : ${existingSections.length} sections`);
    console.log(`          ${[...existingIds].join(", ")}`);
    console.log(`After   : ${newContent.sections.length} sections (prepended ${newSections.length})`);
    console.log(`          ${sectionIds(newContent.sections).join(", ")}`);
    console.log(`Size    : ${bytesOf(existingContent)} → ${bytesOf(newContent)} bytes`);
    console.log(`Updated : ${row.updated_at?.toISOString() ?? "(never)"}`);

    updates.push({ id: row.id, route, newContent });
  }

  if (updates.length === 0) {
    console.log("");
    console.log("Nothing to do — all target routes already contain new sections.");
    process.exit(0);
  }

  if (!CONFIRM) {
    console.log("");
    console.log("─".repeat(70));
    console.log("DRY RUN complete. To apply:");
    console.log("  INGEST_CONFIRM=1 node scripts/ingest-workstream-c.mjs");
    console.log("─".repeat(70));
    process.exit(0);
  }

  console.log("");
  console.log("─".repeat(70));
  console.log(`Applying ${updates.length} update(s)...`);

  for (const { id, route, newContent } of updates) {
    await prisma.content_pages.update({
      where: { id },
      data: { content: newContent, updated_at: new Date() },
    });
    console.log(`✓ Updated ${route} (id=${id})`);
  }

  console.log("");
  console.log("─".repeat(70));
  console.log("Next: rebuild so the updated content_pages are picked up");
  console.log("  npm run build");
  console.log("─".repeat(70));
} finally {
  await prisma.$disconnect();
}
