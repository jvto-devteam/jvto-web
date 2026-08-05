#!/usr/bin/env node
/**
 * validate-people-graph.mjs — People trust-graph acceptance gates (Milestone 2 groundwork).
 *
 * Deterministic, RECORD-LEVEL checks against the ONE canonical people record
 * (content/entities/people.json) + the review-evidence source
 * (src/lib/publicContent/generated/reviewApiSnapshots.json). Pure Node (fs only).
 * There is NO hardcoded people data or forbidden-field list here — every classification
 * (published roster vs known-but-unpublished crew) and the do-not-publish key list are
 * read from people.json.
 *
 * IMPLEMENTED here (record-level):
 *   1. operational crew count is exactly 11 = 7 guides + 4 drivers;
 *   2. no legacy "14" / "7 drivers" crew claim returns;
 *   3. leadership + medical partner never inflate the crew count (countsAsCrew:false, not
 *      in the roster);
 *   4. every crew credential carries a KTA EVIDENCE-REFERENCE (id well-formed + issuer +
 *      evidenceSource + credentialState=confirmed) — a PRESENCE check, NOT an evidence
 *      *match* (no machine-readable KTA source ships in this repo to compare against);
 *   5. HPWKI KTA is a MEMBERSHIP credential, never a "government licence";
 *   6. every crew name a review points to resolves through people.json (published roster
 *      OR the explicit crew.unpublished classification), matched by EXACT normalized display
 *      name with a first-name fallback that is only safe because first names are unique —
 *      the gate FAILS on any first-name ambiguity; no hardcoded exception list;
 *   7. crew.unpublished entries are rendered:false + public:false and never appear in the
 *      published roster;
 *   8. canonical-record do-not-publish field guard: no do-not-publish key
 *      (people.publicFieldAllowlist.doNotPublish) appears at ANY depth of a published crew
 *      record (recursive — catches nested keys like kta.rawKtaCardImage);
 *  10. Mr. Sam (leadership) and Dr. Ahmad Irwandanu (medical partner) carry only supported
 *      relationships and the police non-endorsement disclaimer is present.
 *
 * NOT active in this PR (deferred to the separate Team render-cutover PR — people are not
 * projected to any public surface here): JSON-LD == visible (gate 7), FAQ == canonical
 * records (gate 8), and FEED/RENDER privacy. This guard checks the canonical record only.
 *
 * `--selftest` proves the checks.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PEOPLE_PATH = join(REPO_ROOT, "content", "entities", "people.json");
const REVIEWS_PATH = join(REPO_ROOT, "src", "lib", "publicContent", "generated", "reviewApiSnapshots.json");

const GOVT_LICENCE_RE = /government\s+licen[cs]e/i;
const LEGACY_14_RE = /\b14\b\s*(?:crew|guides?|members?|\+)/i;
const LEGACY_7_DRIVERS_RE = /\b7\s+drivers?\b/i;

const norm = (s) => String(s).trim().toLowerCase();
const firstToken = (s) => norm(s).split(/[\s(]/)[0];

/** Every object key name at any depth of `obj` (lowercased). */
function collectKeyNames(obj, acc = new Set()) {
  if (Array.isArray(obj)) {
    for (const v of obj) collectKeyNames(v, acc);
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      acc.add(k.toLowerCase());
      collectKeyNames(v, acc);
    }
  }
  return acc;
}

/** Run all record-level checks. Returns { failures, checkedLinks }. */
export function checkPeople(people, reviewsSnapshot) {
  const failures = [];
  const fail = (m) => failures.push(m);
  const crew = people?.crew;
  const roster = crew?.roster ?? [];
  const unpublished = crew?.unpublished ?? [];

  // 1. count 11 / 7 / 4
  if (!(crew?.total === 11 && crew?.guides === 7 && crew?.drivers === 4))
    fail(`crew count must be 11/7/4, got total=${crew?.total} guides=${crew?.guides} drivers=${crew?.drivers}`);
  if (roster.length !== 11) fail(`roster must have 11 entries, got ${roster.length}`);
  if (roster.filter((r) => r.role === "guide").length !== 7) fail(`roster must have 7 guides`);
  if (roster.filter((r) => r.role === "driver").length !== 4) fail(`roster must have 4 drivers`);

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

  // 4 (evidence-reference PRESENCE) + 5 (membership-not-licence)
  for (const m of roster) {
    const k = m.kta;
    if (!k?.id || !k?.issuer || !k?.evidenceSource) fail(`crew ${m.code}: KTA lacks id/issuer/evidenceSource`);
    if (k?.credentialState !== "confirmed") fail(`crew ${m.code}: published crew must have KTA credentialState=confirmed`);
    if (m.role === "guide" && !/^KTA-G-\d{4}-\d{3}$/.test(k?.id ?? "")) fail(`guide ${m.code}: KTA id must be well-formed (KTA-G-YYYY-NNN)`);
    if (m.role === "driver" && !/^KTA-D-\d{4}-\d{3}$/.test(k?.id ?? "")) fail(`driver ${m.code}: KTA id must be well-formed (KTA-D-YYYY-NNN)`);
    if (!/member/i.test(k?.credentialType ?? "")) fail(`crew ${m.code}: KTA credentialType must state it is a membership credential`);
    if (GOVT_LICENCE_RE.test(k?.credentialType ?? "")) fail(`crew ${m.code}: KTA must NOT be described as a government licence`);
  }
  if (GOVT_LICENCE_RE.test(recordText)) fail(`the people record describes a KTA/HPWKI as a "government licence" — forbidden`);

  // 7. unpublished crew are non-public / non-rendered and never in the published roster
  for (const u of unpublished) {
    if (u.rendered !== false || u.public !== false) fail(`unpublished crew ${u.code} must be rendered:false + public:false`);
    if (rosterCodes.has(norm(u.code))) fail(`unpublished crew ${u.code} must NOT also appear in the published roster`);
  }

  // 6a. FIRST-NAME AMBIGUITY: a first-name fallback is only safe if first names are unique
  //     across roster + unpublished. Detect duplicates and fail before trusting the fallback.
  const ftCounts = new Map();
  for (const n of [...roster.map((r) => r.name), ...unpublished.map((u) => u.name)]) {
    const f = firstToken(n);
    ftCounts.set(f, (ftCounts.get(f) ?? 0) + 1);
  }
  for (const [f, c] of ftCounts) if (c > 1) fail(`ambiguous first name "${f}" across roster+unpublished — first-name review matching is unsafe`);

  // 6b. every review-named crew resolves through people.json (exact normalized name, then a
  //     first-name fallback that the ambiguity gate above has proven unique).
  const exactNames = new Set([...roster.map((r) => norm(r.name)), ...unpublished.map((u) => norm(u.name))]);
  const firstNames = new Set([...roster.map((r) => firstToken(r.name)), ...unpublished.map((u) => firstToken(u.name))]);
  const feed = reviewsSnapshot?.feed ?? [];
  let checkedLinks = 0;
  for (const rev of feed) {
    for (const c of rev.crews ?? []) {
      checkedLinks++;
      if (!exactNames.has(norm(c.name)) && !firstNames.has(firstToken(c.name)))
        fail(`review ${rev.id} names crew "${c.name}" that resolves to no person in people.json`);
    }
  }

  // 8. canonical-record do-not-publish field guard (recursive; list read from people.json).
  const forbidden = new Set((people?.publicFieldAllowlist?.doNotPublish ?? []).map((k) => norm(k)));
  if (forbidden.size === 0) fail(`publicFieldAllowlist.doNotPublish must list the forbidden field keys`);
  for (const m of roster) {
    for (const key of collectKeyNames(m)) {
      if (forbidden.has(key)) fail(`crew ${m.code}: do-not-publish field "${key}" present on the canonical record (any depth)`);
    }
  }

  // 10. supported relationships only
  const disc = people?.disclaimer;
  if (!disc?.policeIndependence || !/private tour operator/i.test(disc.policeIndependence))
    fail(`police non-endorsement disclaimer missing/weak`);
  if (!disc?.directManagedCrew || /employee|full-time|exclusive/i.test(disc.directManagedCrew))
    fail(`direct-managed-crew claim must not assert employee/full-time/exclusive`);
  if (mp) {
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
  const kta = (p) => ({ id: `KTA-${p}-2024-001`, issuer: "HPWKI", evidenceSource: "OKF", credentialState: "confirmed", credentialType: "HPWKI membership credential (KTA)" });
  const good = {
    disclaimer: { policeIndependence: "JVTO is a private tour operator; no endorsement by police or government.", directManagedCrew: "assigned and managed directly by JVTO, not sourced ad hoc" },
    leadership: [{ id: "agung-sambuko", name: "Agung Sambuko", relationship: "leadership", roles: ["Founder"], countsAsCrew: false }],
    medicalPartner: { id: "dr-x", name: "Dr X", relationship: "medical-screening-coordination", countsAsCrew: false },
    publicFieldAllowlist: { doNotPublish: ["phone", "rawKtaCardImage", "signature"] },
    crew: {
      total: 11, guides: 7, drivers: 4,
      unpublished: [{ code: "yusuf", name: "Yusuf", role: "driver", rendered: false, public: false }],
      roster: [
        ...Array.from({ length: 7 }, (_, i) => ({ code: `g${i}`, name: `Guide${i}`, role: "guide", kta: kta("G") })),
        ...Array.from({ length: 4 }, (_, i) => ({ code: `d${i}`, name: `Driver${i}`, role: "driver", kta: kta("D") })),
      ],
    },
  };
  const feed = { feed: [{ id: 1, crews: [{ name: "Guide0" }] }, { id: 2, crews: [{ name: "Yusuf" }] }] };
  check(checkPeople(good, feed).failures.length === 0, "valid people graph passes");
  check(checkPeople({ ...good, crew: { ...good.crew, total: 14, guides: 7, drivers: 7 } }, feed).failures.length > 0, "14/7-driver count fails");
  check(checkPeople({ ...good, crew: { ...good.crew, roster: good.crew.roster.map((r, i) => (i === 0 ? { ...r, kta: { ...r.kta, credentialType: "government licence" } } : r)) } }, feed).failures.length > 0, "KTA as government licence fails");
  check(checkPeople({ ...good, leadership: [{ ...good.leadership[0], countsAsCrew: true }] }, feed).failures.length > 0, "leadership counted as crew fails");
  check(checkPeople(good, { feed: [{ id: 9, crews: [{ name: "Nobody" }] }] }).failures.length > 0, "review naming a person absent from people.json fails");
  check(checkPeople({ ...good, crew: { ...good.crew, unpublished: [{ code: "g0", name: "Yusuf", role: "driver", rendered: false, public: false }] } }, feed).failures.length > 0, "unpublished crew that is also in the roster fails");
  // NEW: nested do-not-publish field must fail (recursive scan).
  check(
    checkPeople({ ...good, crew: { ...good.crew, roster: good.crew.roster.map((r, i) => (i === 0 ? { ...r, kta: { ...r.kta, rawKtaCardImage: "/uploads/kta_g0.jpg" } } : r)) } }, feed).failures.some((f) => /rawktacardimage/i.test(f)),
    "nested do-not-publish field (kta.rawKtaCardImage) fails",
  );
  // NEW: two people sharing a first name must fail the ambiguity gate.
  check(
    checkPeople({ ...good, crew: { ...good.crew, roster: good.crew.roster.map((r, i) => (i === 1 ? { ...r, name: "Guide0 B" } : r)) } }, feed).failures.some((f) => /ambiguous first name/i.test(f)),
    "duplicate first name across roster fails (ambiguity gate)",
  );
  if (!ok) {
    console.error("[people-graph] SELF-TEST FAILED");
    process.exit(1);
  }
  console.log("[people-graph] self-test PASS (8 cases)");
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
  `[people-graph] PASS (record-level) — 11 crew (7 guides + 4 drivers); leadership + medical partner separate; ` +
    `KTA evidence-reference presence + membership-not-licence; ${checkedLinks} review→person links checked, all resolve via people.json (exact name, no first-name ambiguity); ` +
    `canonical-record do-not-publish field guard clean (recursive). Feed/render/JSON-LD/FAQ projection gates DEFERRED to the Team cutover PR.`,
);
