#!/usr/bin/env node
// Detects drift between content/ (git-owned SSOT for page bodies) and
// jvto-ekosistem's organization-identity/organization.json + credentials-
// and-public-evidence/trust-claims.json + people-and-crew/people.json (the
// single read source for org/trust content -- see jvto-web/README.md's
// "Content sources" section) for a small, named set of facts that exist in
// both places. It used to attempt a third comparison against a "DB source";
// that block was removed 2026-08-28 — see the tombstone further down for why it
// could never have failed.
//
// Until Task 5.3 of the data-source-consolidation plan (2026-08-15), the
// jvto-ekosistem side of this check read jvto-web's own
// src/data/trust-bundle/ (a direct llm-wiki sync). That sync was retired and
// the local copy deleted; this script was repointed at the sibling
// jvto-ekosistem checkout instead, same local-read convention as
// scripts/audit-ecosystem-visible-content.mjs (JVTO_EKOSYSTEM_*_ROOT env
// override, else "../jvto-ekosistem" relative to this repo). If the sibling
// checkout isn't present (e.g. a jvto-web-only clone), these comparisons are
// skipped with a WARN rather than failing the whole script.
//
// This does NOT unify the two/three pipelines (that requires changes to the
// external llm-wiki compiler and/or a larger DB-vs-content migration, both
// out of scope here) -- it only fails loudly when the checked facts
// disagree, so drift is caught instead of silently shipped.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

const ECOSYSTEM_ROOT =
  process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
  path.resolve(process.cwd(), "..", "jvto-ekosistem");

function readEcosystemJson(relPath) {
  return JSON.parse(
    readFileSync(path.join(ECOSYSTEM_ROOT, relPath), "utf8"),
  );
}

const ecosystemAvailable = existsSync(ECOSYSTEM_ROOT);
const warnings = [];

if (!ecosystemAvailable) {
  warnings.push(
    `WARN  jvto-ekosistem checkout not found at ${ECOSYSTEM_ROOT} -- skipping org/claims drift checks against it. Set JVTO_EKOSYSTEM_CONTENT_ROOT or check out the sibling repo to run them.`,
  );
}

const org = ecosystemAvailable
  ? readEcosystemJson(
      "1-knowledge-and-evidence-core/organization-identity/organization.json",
    )
  : null;
const claims = ecosystemAvailable
  ? readEcosystemJson(
      "1-knowledge-and-evidence-core/credentials-and-public-evidence/trust-claims.json",
    ).claims
  : [];
const people = ecosystemAvailable
  ? readEcosystemJson("1-knowledge-and-evidence-core/people-and-crew/people.json")
  : null;
const founder = people?.leadership?.find((p) =>
  (p.roles ?? []).includes("Founder"),
);

// entityGraph.ts is TypeScript with computed values (template literals,
// constants) -- rather than executing/transpiling it here, read it as text
// and extract the specific literal values this check cares about. This is
// intentionally narrow: it only extracts values that are plain string
// literals in the current file, and will need updating if entityGraph.ts's
// literal formatting changes materially.
const entityGraphSrc = readFileSync(
  path.join(process.cwd(), "src/lib/schemas/entityGraph.ts"),
  "utf8",
);

function extractLiteral(source, fieldPattern) {
  const match = source.match(fieldPattern);
  return match ? match[1] : null;
}

const entityGraphTaxId = extractLiteral(entityGraphSrc, /taxID:\s*'([^']+)'/);
// Anchored on AGUNG_ID rather than on a named constant. This used to match
// `export const FOUNDER_SCHEMA`, which became `buildFounderSchema(facts)` in a
// refactor. The pattern then matched nothing, the check reported "could not
// extract — treat as a failure to investigate", and it stayed red without
// anything actually being wrong. A checker anchored on a name breaks the day
// that name changes; anchoring on the @id it emits survives the rename.
const entityGraphFounderName = (() => {
  const founderBlockMatch = entityGraphSrc.match(
    /'@id':\s*AGUNG_ID,[\s\S]{0,200}?name:\s*'([^']+)'/,
  );
  return founderBlockMatch ? founderBlockMatch[1] : null;
})();

let failures = 0;

function checkFact(label, sourceAValue, sourceALabel, sourceBValue, sourceBLabel) {
  if (sourceAValue == null || sourceBValue == null) {
    failures++;
    console.error(
      `FAIL  ${label}: could not extract from one or both sources (${sourceALabel}=${sourceAValue}, ${sourceBLabel}=${sourceBValue}) -- extraction pattern may be stale, treat as a failure to investigate, not a pass.`,
    );
    return;
  }
  if (normalize(sourceAValue) !== normalize(sourceBValue)) {
    failures++;
    console.error(
      `FAIL  ${label}: "${sourceAValue}" (${sourceALabel}) != "${sourceBValue}" (${sourceBLabel})`,
    );
  } else {
    console.log(`OK    ${label}: "${sourceAValue}" matches across both sources.`);
  }
}

const ORG_SOURCE_LABEL =
  "jvto-ekosistem organization-identity/organization.json";

const nibIdentifier = org?.identifiers?.find((i) => i.type === "NIB");
const tdupIdentifier = org?.identifiers?.find((i) => i.type === "TDUP");

if (ecosystemAvailable) {
  checkFact(
    "NIB number",
    nibIdentifier?.value,
    ORG_SOURCE_LABEL,
    entityGraphTaxId,
    "entityGraph.ts ORGANIZATION_SCHEMA.taxID",
  );

  checkFact(
    "Founder name",
    founder?.name,
    "jvto-ekosistem people-and-crew/people.json (leadership[roles includes Founder])",
    entityGraphFounderName,
    "entityGraph.ts buildFounderSchema (anchored on AGUNG_ID)",
  );

  checkFact(
    "Organization legal name",
    org.legalName,
    ORG_SOURCE_LABEL,
    extractLiteral(entityGraphSrc, /legalName:\s*'([^']+)'/),
    "entityGraph.ts ORGANIZATION_SCHEMA.legalName",
  );

  // Known pre-existing data-quality issue: NIB and TDUP should NOT share a
  // value (they are different credentials -- NIB is national business
  // registration, TDUP is the Tourism Business Permit, documented elsewhere as
  // separately issued -- see jvto-ekosistem's why-jvto/our-story.source.json).
  // Flag it as a warning, not a failure -- fixing it means hand-editing
  // jvto-ekosistem's content, which is out of scope here; this just makes
  // sure nobody misses it.
  if (nibIdentifier?.value && tdupIdentifier?.value && nibIdentifier.value === tdupIdentifier.value) {
    warnings.push(
      `WARN  ${ORG_SOURCE_LABEL}: NIB and TDUP identifiers share the same value ("${nibIdentifier.value}") -- these are documented elsewhere in this repo as different credentials. Likely a data error upstream. Raise with the content owner; do not hand-edit this file to fix it (see jvto-ekosistem's own "do not hand-edit" note in its trust-claims.json _comment).`,
    );
  }

  console.log(
    `\n${claims.length} canonical claims found in jvto-ekosistem's credentials-and-public-evidence/trust-claims.json (C1-C${claims.length}).`,
  );
}

// ---- Third source: REMOVED 2026-08-28 ----
// This block compared jvto-ekosistem against getPublicOrganizationProfile(),
// labelled "the DB source". It never ran: the dynamic import of a .ts file using
// the "@/..." alias always threw, so every run emitted the same WARN telling the
// reader to install `tsx` to make it work.
//
// Installing tsx would have made it worse, not better. getPublicOrganizationProfile()
// stopped reading Prisma on 2026-08-19 — it now composes getEcosystemOrganizationNode()
// with a static snapshot fallback. So the "DB vs ekosistem" comparison would have
// compared ekosistem against ekosistem and passed by construction, while reporting
// itself as an independent third source.
//
// A check that cannot fail is not a check. The real DB-vs-registry comparison still
// exists and still runs: scripts/validate-package-readiness-consumption.mjs.

if (warnings.length) {
  console.log("\n--- Warnings (not failures) ---");
  for (const w of warnings) console.log(w);
}

if (failures > 0) {
  console.error(`\n${failures} fact-drift failure(s) found. Fix the disagreement before shipping.`);
  process.exit(1);
}

console.log("\nNo fact drift detected in the checked fields.");
process.exit(0);
