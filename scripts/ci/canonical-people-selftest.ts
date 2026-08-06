/**
 * Self-test for src/lib/people/canonicalPeople.ts — proves the DB-free reader's
 * privacy + fact invariants before any route reads through it:
 *   - 11 public crew = 7 guides + 4 drivers;
 *   - crew.unpublished (KTA-pending) are NEVER public (excluded + resolve null);
 *   - public crew carry ONLY publicFieldAllowlist.crew fields (no evidenceSource
 *     /reviewedDate, no doNotPublish key);
 *   - leadership + medical partner never count as crew.
 */
import {
  getCanonicalPeople,
  getPublicCrew,
  getPublicGuides,
  getPublicDrivers,
  getPublicCrewByCode,
  getPublicCrewCodes,
  getUnpublishedCrewCodes,
  getCrewCounts,
  getPublicLeadership,
  getPublicMedicalPartner,
  getPublicFieldAllowlist,
} from "../../src/lib/people/canonicalPeople";

let fail = 0;
const ok = (m: string) => console.log(`  ok    ${m}`);
const bad = (m: string) => {
  console.error(`  FAIL  ${m}`);
  fail = 1;
};
const eq = (a: unknown, b: unknown, m: string) =>
  JSON.stringify(a) === JSON.stringify(b) ? ok(m) : bad(`${m} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);

console.log("[canonical-people-selftest]");

// 1. counts 11 / 7 / 4, consistent with the projected roster.
const counts = getCrewCounts();
eq(counts, { total: 11, guides: 7, drivers: 4 }, "crew counts 11/7/4");
eq(getPublicCrew().length, 11, "getPublicCrew() length 11");
eq(getPublicGuides().length, 7, "7 public guides");
eq(getPublicDrivers().length, 4, "4 public drivers");

// 2. unpublished crew are never public.
const unpublished = getUnpublishedCrewCodes();
if (unpublished.length === 0) bad("expected at least one unpublished code (yusuf/dika/pras)");
const publicCodes = new Set(getPublicCrewCodes());
for (const code of unpublished) {
  if (publicCodes.has(code)) bad(`unpublished code '${code}' leaked into public crew`);
  else ok(`unpublished '${code}' excluded from public crew`);
  if (getPublicCrewByCode(code) !== null) bad(`getPublicCrewByCode('${code}') must be null`);
  else ok(`getPublicCrewByCode('${code}') === null`);
}

// 3. lookup by code: published resolves, unknown → null.
if (getPublicCrewByCode("anjas")) ok("getPublicCrewByCode('anjas') resolves");
else bad("getPublicCrewByCode('anjas') should resolve");
if (getPublicCrewByCode("does-not-exist") === null) ok("unknown code → null");
else bad("unknown code should be null");

// 4. allowlist projection: public crew carry ONLY the allowlisted fields.
const allowlist = getPublicFieldAllowlist();
const allowedTop = new Set(allowlist.crew.map((f) => f.split(".")[0]));
const allowedKta = new Set(
  allowlist.crew.filter((f) => f.startsWith("kta.")).map((f) => f.split(".")[1]),
);
for (const m of getPublicCrew() as unknown as Record<string, any>[]) {
  for (const k of Object.keys(m)) {
    if (!allowedTop.has(k)) bad(`public crew '${m.code}' exposes non-allowlisted top field '${k}'`);
  }
  for (const k of Object.keys(m.kta)) {
    if (!allowedKta.has(k)) bad(`public crew '${m.code}' exposes non-allowlisted kta.${k}`);
  }
  // explicit: internal provenance never public
  if ("evidenceSource" in m.kta) bad(`public crew '${m.code}' leaked kta.evidenceSource`);
  if ("reviewedDate" in m.kta) bad(`public crew '${m.code}' leaked kta.reviewedDate`);
  // KTA is a membership credential, never a government licence
  if (/licen[cs]e|government/i.test(String(m.kta.credentialType)))
    bad(`crew '${m.code}' kta.credentialType must not read as a government licence`);
}
ok("public crew projected to allowlisted fields only (no evidenceSource/reviewedDate)");

// 5. leadership + medical partner never crew (fact, from the raw record).
const rec = getCanonicalPeople() as any;
if (rec.leadership.every((l: any) => l.countsAsCrew === false)) ok("leadership countsAsCrew=false");
else bad("leadership must not count as crew");
if (rec.medicalPartner.countsAsCrew === false) ok("medical partner countsAsCrew=false");
else bad("medical partner must not count as crew");

// 5b. leadership + medicalPartner PROJECTIONS carry ONLY allowlisted fields.
const collectPaths = (obj: Record<string, any>): string[] => {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const sk of Object.keys(v)) out.push(`${k}.${sk}`);
    } else out.push(k);
  }
  return out;
};
const leadAllow = new Set(getPublicFieldAllowlist().leadership);
for (const l of getPublicLeadership() as unknown as Record<string, any>[]) {
  for (const p of collectPaths(l)) if (!leadAllow.has(p)) bad(`leadership projection exposes non-allowlisted '${p}'`);
  for (const forbidden of ["namingRule", "evidence", "countsAsCrew"]) {
    if (forbidden in l) bad(`leadership projection leaked '${forbidden}'`);
  }
}
ok("leadership projection = allowlisted fields only (no namingRule/evidence/countsAsCrew)");

const medAllow = new Set(getPublicFieldAllowlist().medicalPartner);
const mp = getPublicMedicalPartner() as unknown as Record<string, any>;
for (const p of collectPaths(mp)) if (!medAllow.has(p)) bad(`medicalPartner projection exposes non-allowlisted '${p}'`);
for (const forbidden of ["relationshipNote", "countsAsCrew"]) {
  if (forbidden in mp) bad(`medicalPartner projection leaked '${forbidden}'`);
}
if (mp.credentials && "lastVerified" in mp.credentials) bad("medicalPartner projection leaked credentials.lastVerified");
ok("medicalPartner projection = allowlisted fields only (no relationshipNote/lastVerified/countsAsCrew)");

// 6. doNotPublish list is present + non-empty (data-driven privacy source).
if (allowlist.doNotPublish.length > 0) ok(`doNotPublish declares ${allowlist.doNotPublish.length} keys`);
else bad("publicFieldAllowlist.doNotPublish must be a non-empty list");

if (fail) {
  console.error("[canonical-people-selftest] FAIL");
  process.exit(1);
}
console.log("[canonical-people-selftest] PASS");
