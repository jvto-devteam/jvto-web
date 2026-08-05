#!/usr/bin/env node
/**
 * validate-people-graph.mjs — People trust-graph acceptance gates (Milestone 2 people cluster).
 *
 * Deterministic, record-level checks against the ONE canonical people record
 * (content/entities/people.json) + the review-evidence source
 * (src/lib/publicContent/generated/reviewApiSnapshots.json). Pure Node (fs only).
 *
 * Gates implemented here (owner acceptance list):
 *   1. operational crew count is exactly 11 = 7 guides + 4 drivers;
 *   2. no legacy "14" / "7 drivers" crew claim returns;
 *   3. leadership + medical partner never inflate the crew count (countsAsCrew:false,
 *      not present in the roster);
 *   4. every guide credential has matching evidence (kta.id + issuer + evidenceSource +
 *      credentialState=confirmed);
 *   5. HPWKI KTA is a MEMBERSHIP credential, never a "government licence";
 *   6. every crew name a review points to resolves to a real person (roster code or a
 *      known unpublished-pending crew) — no review names a nonexistent/mismatched person;
 *   9. no do-not-publish / private field appears on any published crew record (feed safety);
 *  10. Mr. Sam (leadership) and Dr. Ahmad Irwandanu (medical partner) carry only supported
 *      relationships — never "employee"/"worksFor JVTO" for the doctor, and the police
 *      non-endorsement disclaimer is present.
 *
 * Gates 7 (JSON-LD == visible) and 8 (FAQ == canonical records) are render-parity checks;
 * they are activated with the /team render cutover (a rendered-DOM snapshot compare) — this
 * script asserts the DATA the render must reproduce. `--selftest` proves the checks.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PEOPLE_PATH = join(REPO_ROOT, "content", "entities", "people.json");
const REVIEWS_PATH = join(REPO_ROOT, "src", "lib", "publicContent", "generated", "reviewApiSnapshots.json");

/** Crew known to exist but intentionally unpublished (KTA pending) — valid review targets. */
const KNOWN_PENDING = ["yusuf", "dika", "pras"];
const GOVT_LICENCE_RE = /government\s+licen[cs]e/i;
const LEGACY_14_RE = /\b14\b\s*(?:crew|guides?|members?|\+)/i;
const LEGACY_7_DRIVERS_RE = /\b7\s+drivers?\b/i;
const PRIVATE_KEYS = ["phone", "personalInstagram", "personalFacebook", "homeAddress", "signature", "internalDbId", "package_id", "reviewerProfilePhoto"];

const norm = (s) => String(s).trim().toLowerCase();

/** Run all record-level checks. Returns { failures: string[] }. */
export function checkPeople(people, reviewsSnapshot) {
  const failures = [];
  const fail = (m) => failures.push(m);
  const crew = people?.crew;
  const roster = crew?.roster ?? [];

  // 1. count 11 / 7 / 4
  if (!(crew?.total === 11 && crew?.guides === 7 && crew?.drivers === 4))
    fail(`crew count must be 11/7/4, got total=${crew?.total} guides=${crew?.guides} drivers=${crew?.drivers}`);
  if (roster.length !== 11) fail(`roster must have 11 entries, got ${roster.length}`);
  const guides = roster.filter((r) => r.role === "guide");
  const drivers = roster.filter((r) => r.role === "driver");
  if (guides.length !== 7) fail(`roster must have 7 guides, got ${guides.length}`);
  if (drivers.length !== 4) fail(`roster must have 4 drivers, got ${drivers.length}`);

  // 2. no legacy 14 / 7-driver claim anywhere in the record text
  const recordText = JSON.stringify(people);
  if (LEGACY_14_RE.test(recordText)) fail(`legacy "14 crew" claim present in the people record`);
  if (LEGACY_7_DRIVERS_RE.test(recordText)) fail(`legacy "7 drivers" claim present in the people record`);

  // 3. leadership + medical never counted as crew / never in roster
  const rosterCodes = new Set(roster.map((r) => norm(r.code)));
  for (const l of people?.leadership ?? []) {
    if (l.countsAsCrew !== false) fail(`leadership ${l.id} must have countsAsCrew:false`);
    if (rosterCodes.has(norm(l.id))) fail(`leadership ${l.id} must not appear in the crew roster`);
  }
  const mp = people?.medicalPartner;
  if (mp) {
    if (mp.countsAsCrew !== false) fail(`medicalPartner ${mp.id} must have countsAsCrew:false`);
    if (rosterCodes.has(norm(mp.id))) fail(`medicalPartner ${mp.id} must not appear in the crew roster`);
  }

  // 4 + 5. per-guide (and driver) KTA evidence + membership-not-licence wording
  for (const m of roster) {
    const k = m.kta;
    if (!k?.id || !k?.issuer || !k?.evidenceSource) fail(`crew ${m.code}: KTA lacks id/issuer/evidenceSource`);
    if (k?.credentialState !== "confirmed") fail(`crew ${m.code}: published crew must have KTA credentialState=confirmed`);
    if (m.role === "guide" && !/^KTA-G-/.test(k?.id ?? "")) fail(`guide ${m.code}: KTA id must be a guide code (KTA-G-…)`);
    if (m.role === "driver" && !/^KTA-D-/.test(k?.id ?? "")) fail(`driver ${m.code}: KTA id must be a driver code (KTA-D-…)`);
    if (!/member/i.test(k?.credentialType ?? "")) fail(`crew ${m.code}: KTA credentialType must state it is a membership credential`);
    if (GOVT_LICENCE_RE.test(k?.credentialType ?? "")) fail(`crew ${m.code}: KTA must NOT be described as a government licence`);
  }
  if (GOVT_LICENCE_RE.test(recordText)) fail(`the people record describes a KTA/HPWKI as a "government licence" — forbidden`);

  // 6. every review-named crew resolves to a real person
  const allowedNames = new Set([...roster.map((r) => norm(r.name)), ...KNOWN_PENDING]);
  const allowedFirstWords = new Set([...roster.map((r) => norm(r.name).split(/[\s(]/)[0]), ...KNOWN_PENDING]);
  const feed = reviewsSnapshot?.feed ?? [];
  let checkedLinks = 0;
  for (const rev of feed) {
    for (const c of rev.crews ?? []) {
      checkedLinks++;
      const n = norm(c.name);
      const first = n.split(/[\s(]/)[0];
      if (!allowedNames.has(n) && !allowedFirstWords.has(first))
        fail(`review ${rev.id} names crew "${c.name}" that resolves to no known person`);
    }
  }

  // 9. no private field key on a published crew record
  for (const m of roster) {
    for (const key of PRIVATE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(m, key)) fail(`crew ${m.code}: private field "${key}" must not be published`);
    }
  }

  // 10. supported relationships only
  const disc = people?.disclaimer;
  if (!disc?.policeIndependence || !/private tour operator/i.test(disc.policeIndependence))
    fail(`police non-endorsement disclaimer missing/weak`);
  if (!disc?.directManagedCrew || /employee|full-time|exclusive/i.test(disc.directManagedCrew))
    fail(`direct-managed-crew claim must not assert employee/full-time/exclusive`);
  if (mp) {
    // Only a POSITIVE employment assertion is forbidden — the `relationship`/`worksFor`
    // fields, not the word "employee" inside a disclaimer like "Not an employee…".
    if (/employee|works?.?for/i.test(String(mp.relationship ?? ""))) fail(`medical partner relationship must not assert employment`);
    if (mp.worksFor && /jvto|java volcano/i.test(String(mp.worksFor))) fail(`medical partner must not assert worksFor JVTO`);
  }
  for (const l of people?.leadership ?? []) {
    if (l.relationship !== "leadership") fail(`leadership ${l.id}: relationship must be "leadership"`);
  }

  return { failures, checkedLinks };
}

function selftest() {
  let ok = true;
  const check = (cond, label) => {
    console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
    if (!cond) ok = false;
  };
  const good = {
    disclaimer: { policeIndependence: "JVTO is a private tour operator; no endorsement by police or government.", directManagedCrew: "assigned and managed directly by JVTO, not sourced ad hoc" },
    leadership: [{ id: "agung-sambuko", name: "Agung Sambuko", relationship: "leadership", roles: ["Founder"], countsAsCrew: false }],
    medicalPartner: { id: "dr-x", name: "Dr X", relationship: "medical-screening-coordination", countsAsCrew: false },
    crew: {
      total: 11, guides: 7, drivers: 4,
      roster: [
        ...Array.from({ length: 7 }, (_, i) => ({ code: `g${i}`, name: `Guide${i}`, role: "guide", kta: { id: "KTA-G-2024-001", issuer: "HPWKI", evidenceSource: "OKF", credentialState: "confirmed", credentialType: "HPWKI membership credential (KTA)" } })),
        ...Array.from({ length: 4 }, (_, i) => ({ code: `d${i}`, name: `Driver${i}`, role: "driver", kta: { id: "KTA-D-2024-001", issuer: "HPWKI", evidenceSource: "OKF", credentialState: "confirmed", credentialType: "HPWKI membership credential (KTA)" } })),
      ],
    },
  };
  const feed = { feed: [{ id: 1, crews: [{ name: "Guide0" }] }, { id: 2, crews: [{ name: "Yusuf" }] }] };
  check(checkPeople(good, feed).failures.length === 0, "valid people graph passes");
  check(checkPeople({ ...good, crew: { ...good.crew, total: 14, guides: 7, drivers: 7 } }, feed).failures.length > 0, "14/7-driver count fails");
  check(checkPeople({ ...good, crew: { ...good.crew, roster: good.crew.roster.map((r, i) => (i === 0 ? { ...r, kta: { ...r.kta, credentialType: "government licence" } } : r)) } }, feed).failures.length > 0, "KTA as government licence fails");
  check(checkPeople({ ...good, leadership: [{ ...good.leadership[0], countsAsCrew: true }] }, feed).failures.length > 0, "leadership counted as crew fails");
  check(checkPeople(good, { feed: [{ id: 9, crews: [{ name: "Nobody" }] }] }).failures.length > 0, "review naming nonexistent person fails");
  const withPrivate = { ...good, crew: { ...good.crew, roster: good.crew.roster.map((r, i) => (i === 0 ? { ...r, phone: "+62..." } : r)) } };
  check(checkPeople(withPrivate, feed).failures.length > 0, "private field on crew fails");
  if (!ok) {
    console.error("[people-graph] SELF-TEST FAILED");
    process.exit(1);
  }
  console.log("[people-graph] self-test PASS (6 cases)");
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}
selftest();

if (!existsSync(PEOPLE_PATH)) {
  console.error(`[people-graph] FAIL — canonical record missing: ${PEOPLE_PATH}`);
  process.exit(1);
}
const people = JSON.parse(readFileSync(PEOPLE_PATH, "utf8"));
const reviews = existsSync(REVIEWS_PATH) ? JSON.parse(readFileSync(REVIEWS_PATH, "utf8")) : { feed: [] };
const { failures, checkedLinks } = checkPeople(people, reviews);
if (failures.length) {
  console.error(`\n[people-graph] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[people-graph] PASS — 11 crew (7 guides + 4 drivers), leadership + medical partner separate, ` +
    `${checkedLinks} review→person links all resolve, KTA membership-not-licence, privacy allowlist clean.`,
);
