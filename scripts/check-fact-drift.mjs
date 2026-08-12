#!/usr/bin/env node
// Detects drift between content/ (git-owned SSOT for page bodies) and
// src/data/trust-bundle/ (synced from the external llm-wiki, feeds only
// /llms.txt) for a small, named set of facts that exist in both places.
// It also attempts a third comparison against the DB-driven organization
// profile (getPublicOrganizationProfile()), degrading to a WARN (not a
// failure) if that source can't be reached from this environment.
//
// This does NOT unify the two/three pipelines (that requires changes to the
// external llm-wiki sync and/or a larger DB-vs-content migration, both out
// of scope here) -- it only fails loudly when the checked facts disagree,
// so drift is caught instead of silently shipped.
import { readFileSync } from "node:fs";
import path from "node:path";

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(process.cwd(), relPath), "utf8"));
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

const org = readJson("src/data/trust-bundle/schema/organization.json");
const claims = readJson("src/data/trust-bundle/claims.json").claims;

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
const entityGraphFounderName = (() => {
  const founderBlockMatch = entityGraphSrc.match(
    /export const FOUNDER_SCHEMA[\s\S]*?name:\s*'([^']+)'/,
  );
  return founderBlockMatch ? founderBlockMatch[1] : null;
})();

let failures = 0;
const warnings = [];

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

const nibIdentifier = (org.identifier ?? []).find((i) => i.propertyID === "NIB");
const tdupIdentifier = (org.identifier ?? []).find((i) => i.propertyID === "TDUP");

checkFact(
  "NIB number",
  nibIdentifier?.value,
  "trust-bundle/schema/organization.json",
  entityGraphTaxId,
  "entityGraph.ts ORGANIZATION_SCHEMA.taxID",
);

checkFact(
  "Founder name",
  org.founder?.name,
  "trust-bundle/schema/organization.json",
  entityGraphFounderName,
  "entityGraph.ts FOUNDER_SCHEMA.name",
);

checkFact(
  "Organization legal name",
  org.legalName,
  "trust-bundle/schema/organization.json",
  extractLiteral(entityGraphSrc, /legalName:\s*'([^']+)'/),
  "entityGraph.ts ORGANIZATION_SCHEMA.legalName",
);

// Known pre-existing data-quality issue: NIB and TDUP should NOT share a
// value (they are different credentials -- NIB is national business
// registration, TDUP is the Tourism Business Permit, documented elsewhere in
// this repo's ported content e.g. content/pages/why-jvto/our-story.json as
// separately issued). Flag it as a warning, not a failure -- fixing it means
// hand-editing the externally-synced trust-bundle, which is out of scope
// here (its own header comment says "Do NOT hand-edit"); this just makes
// sure nobody misses it.
if (nibIdentifier?.value && tdupIdentifier?.value && nibIdentifier.value === tdupIdentifier.value) {
  warnings.push(
    `WARN  trust-bundle/schema/organization.json: NIB and TDUP identifiers share the same value ("${nibIdentifier.value}") -- these are documented elsewhere in this repo as different credentials. Likely a data error in the external llm-wiki sync. Raise with the trust-bundle/llm-wiki owner; do not hand-edit this file to fix it.`,
  );
}

console.log(`\n${claims.length} canonical claims found in trust-bundle/claims.json (C1-C${claims.length}).`);

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

    // Real field name on the Prisma organization_profile row / snapshot
    // fallback is `legal_name` (see prisma/schema.prisma and
    // src/lib/publicContent/organizationSnapshot.ts) -- not `legalName`.
    checkFact(
      "Organization legal name (DB source)",
      dbOrg.legal_name,
      "getPublicOrganizationProfile()",
      org.legalName,
      "trust-bundle/schema/organization.json",
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
      "trust-bundle/schema/organization.json",
    );
    checkFact(
      "Founder name (DB source)",
      dbFounderName,
      "getPublicOrganizationProfile()",
      org.founder?.name,
      "trust-bundle/schema/organization.json",
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
