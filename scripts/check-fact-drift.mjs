#!/usr/bin/env node
// Detects drift between content/ (git-owned SSOT for page bodies) and
// jvto-ekosistem's organization-identity/organization.json + credentials-
// and-public-evidence/trust-claims.json + people-and-crew/people.json (the
// single read source for org/trust content -- see jvto-web/README.md's
// "Content sources" section) for a small, named set of facts that exist in
// both places. It also attempts a fourth comparison against the DB-driven
// organization profile (getPublicOrganizationProfile()), degrading to a WARN
// (not a failure) if that source can't be reached from this environment.
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

// ---- Third source: the DB-driven organization profile (Prisma) ----
// Gracefully skipped (WARN, not FAIL) if it can't be reached -- see the
// task's own note on why this must never hard-fail the whole script.
//
// Important nuance discovered while wiring this up: getPublicOrganizationProfile()
// (src/lib/publicContent/getPublicOrganizationProfile.ts) is TypeScript and
// imports via the "@/..." path alias (e.g. "@/lib/prisma"), which is a
// TypeScript/Next.js-only resolution feature -- plain Node cannot resolve it
// even though Node 22+ can strip TS syntax natively. There is also no
// tsx/ts-node devDependency in this repo's package.json today, and no
// existing script in scripts/ imports a .ts file directly (they all import
// PrismaClient from the generated relative path instead, e.g.
// "../src/generated/prisma/index.js" in scripts/insert-content-moat-pages.mjs).
// Per the task's own guidance, this is left as a documented WARN-only
// limitation rather than adding a new dependency just for this check.
//
// Separately (independent of whether the import succeeds): even when
// getPublicOrganizationProfile() runs for real, it only queries
// prisma.organization_profile when NODE_ENV !== 'production' (or an explicit
// opt-in env flag is set) AND process.env.PUBLIC_CONTENT_PREFER_DB_ORGANIZATION
// === 'true'. With neither flag set, it returns the hardcoded
// publicOrganizationProfileSnapshot object instead of a live DB row. And the
// organization_profile Prisma model itself (prisma/schema.prisma) has no
// nib/founder columns at all -- only legal_name is realistically comparable
// against this source; NIB and founder are not tracked there today.
async function checkDbSource() {
  let getPublicOrganizationProfile;
  try {
    ({ getPublicOrganizationProfile } = await import(
      "../src/lib/publicContent/getPublicOrganizationProfile.ts"
    ));
  } catch (e) {
    warnings.push(
      `WARN  DB source: could not import getPublicOrganizationProfile.ts (${e.message}). Skipping DB-vs-file comparison. This file is TypeScript and uses the "@/..." path alias, which plain Node cannot resolve -- if this import fails specifically because Node can't load .ts/alias imports directly, re-run this script with a TS+paths loader (e.g. \`node --import tsx scripts/check-fact-drift.mjs\`) if the tsx package is available in this repo; as of this writing it is not a devDependency here.`,
    );
    return;
  }

  try {
    const dbOrg = await getPublicOrganizationProfile();
    if (!dbOrg) {
      warnings.push("WARN  DB source: getPublicOrganizationProfile() returned null/empty -- skipping DB comparison.");
      return;
    }

    if (!ecosystemAvailable) {
      warnings.push(
        "WARN  DB source: jvto-ekosistem checkout unavailable -- skipping DB-vs-ekosistem comparisons (legal name / NIB / founder).",
      );
      return;
    }

    // Real field name on the Prisma organization_profile row / snapshot
    // fallback is `legal_name` (see prisma/schema.prisma and
    // src/lib/publicContent/organizationSnapshot.ts) -- not `legalName`.
    checkFact(
      "Organization legal name (DB source)",
      dbOrg.legal_name,
      "getPublicOrganizationProfile()",
      org.legalName,
      ORG_SOURCE_LABEL,
    );

    // organization_profile has no nib/founder columns today (confirmed via
    // prisma/schema.prisma), so these can only ever resolve from a
    // best-effort schema_json blob if one is populated. Left as a WARN
    // (not a FAIL) when absent, rather than guessing at field names that
    // don't exist on the model.
    const schemaJson = dbOrg.schema_json;
    const dbNib =
      dbOrg.nib ??
      dbOrg.taxId ??
      (schemaJson &&
        (Array.isArray(schemaJson?.identifier)
          ? schemaJson.identifier.find((i) => i.propertyID === "NIB")?.value
          : undefined));
    const dbFounderName = dbOrg.founderName ?? dbOrg.founder?.name ?? schemaJson?.founder?.name;

    checkFact(
      "NIB number (DB source)",
      dbNib,
      "getPublicOrganizationProfile()",
      nibIdentifier?.value,
      ORG_SOURCE_LABEL,
    );
    checkFact(
      "Founder name (DB source)",
      dbFounderName,
      "getPublicOrganizationProfile()",
      founder?.name,
      "jvto-ekosistem people-and-crew/people.json (leadership[roles includes Founder])",
    );
  } catch (e) {
    warnings.push(
      `WARN  DB source: query failed (${e.message}) -- likely no DATABASE_URL / no DB reachable from this environment. Skipping DB comparison; this is expected and acceptable in a DB-less context, do not invent credentials to force it to connect.`,
    );
  }
}

await checkDbSource();

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
