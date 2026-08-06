/**
 * Team render-parity test (Team render-cutover). Proves the SERVED build output of
 * /team + /team/[slug] is a faithful projection of the canonical people record
 * (content/entities/people.json) — nothing invented, nothing leaked.
 *
 * It runs against a REAL running server (build → `next start` → this test), so every
 * assertion is on an actual HTTP 200 response body, not a source read. Set the base
 * URL via TEAM_PARITY_BASE_URL (e.g. http://127.0.0.1:3100).
 *
 * Asserts, entirely against served HTML/JSON:
 *   1. /team is HTTP 200, canonical = <origin>/team.
 *   2. Counts 11/7/4 are the rendered truth (header + section counts).
 *   3. The 11 published crew names render visibly AND appear in the ItemList JSON-LD
 *      (visible == JSON-LD); ItemList numberOfItems == 11.
 *   4. The Team FAQ is DERIVED from the record: visible FAQ questions == FAQPage
 *      JSON-LD questions == buildTeamFaqs() (FAQ == record).
 *   5. Each /team/[code] is HTTP 200, canonical correct, and the visible name +
 *      specialties + languages equal the ProfilePage→Person JSON-LD (visible == JSON-LD);
 *      KTA renders as a membership credential (credentialCategory "membership").
 *   6. Every crew.unpublished code (yusuf/dika/pras) is HTTP 404 — no route, no HTML,
 *      no JSON-LD — and absent from the hub + the knowledge feed.
 *   7. No allowlist-STRIPPED internal value (kta.evidenceSource / kta.reviewedDate /
 *      leadership.namingRule / leadership.evidence.* / medicalPartner.relationshipNote /
 *      credentials.lastVerified / …) appears anywhere in the served HTML or feed.
 *   8. /api/knowledge-feed people projection: crew counts 11/7/4, 11 members, none
 *      unpublished, and no allowlist-stripped internal value leaked.
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
} from "../../src/lib/people/canonicalPeople";
import { buildTeamFaqs } from "../../src/lib/people/teamFaqs";

const BASE = (process.env.TEAM_PARITY_BASE_URL || "").replace(/\/+$/, "");
const ORIGIN = "https://javavolcano-touroperator.com";

let fail = 0;
const ok = (m: string) => console.log(`  ok    ${m}`);
const bad = (m: string) => {
  console.error(`  FAIL  ${m}`);
  fail = 1;
};
const assert = (cond: boolean, m: string) => (cond ? ok(m) : bad(m));

if (!BASE) {
  console.error("TEAM_PARITY_BASE_URL is required (e.g. http://127.0.0.1:3100)");
  process.exit(2);
}

type Res = { status: number; text: string };
async function get(pathname: string): Promise<Res> {
  const r = await fetch(`${BASE}${pathname}`, { redirect: "manual" });
  return { status: r.status, text: await r.text() };
}

/** Strip tags → visible text (entities decoded for the few we emit). */
function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    // React inserts `<!-- -->` as an empty text separator between adjacent nodes
    // (e.g. `Guides (` + {7} + `)`); remove comments with NO substitute so the
    // parts rejoin exactly as a human reads them ("Guides (7)"), not "( 7 )".
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** All JSON-LD nodes (flattening @graph and top-level arrays). */
function jsonLd(html: string): any[] {
  const out: any[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node && Array.isArray(node["@graph"])) out.push(...node["@graph"]);
        else out.push(node);
      }
    } catch {
      bad("un-parseable JSON-LD <script> block");
    }
  }
  return out;
}
const canonical = (html: string): string | null =>
  html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
  html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ??
  null;
const byType = (nodes: any[], t: string) => nodes.filter((n) => n?.["@type"] === t);

/**
 * The concrete internal VALUES that the allowlist projection STRIPS — computed as the
 * raw record MINUS the public projection (crew / leadership / medicalPartner). These are
 * exactly the fields the owner requires kept out of output: kta.evidenceSource /
 * kta.reviewedDate, leadership.namingRule / leadership.evidence.*, medicalPartner
 * .relationshipNote / credentials.lastVerified, etc. Any of these appearing verbatim in
 * served HTML or the feed is a privacy-projection leak. (This is stronger + more precise
 * than reading publicFieldAllowlist.doNotPublish, which lists never-stored PII keys that
 * are absent from the record by design and so carry no values to compare.)
 */
function scalarLeaves(obj: any, prefix = "", out = new Map<string, unknown>()): Map<string, unknown> {
  if (obj == null) return out;
  if (Array.isArray(obj)) obj.forEach((v, i) => scalarLeaves(v, `${prefix}[${i}]`, out));
  else if (typeof obj === "object") for (const [k, v] of Object.entries(obj)) scalarLeaves(v, prefix ? `${prefix}.${k}` : k, out);
  else out.set(prefix, obj);
  return out;
}
function strippedBetween(raw: any, projected: any, sink: Set<string>) {
  const rawLeaves = scalarLeaves(raw);
  const projPaths = new Set(scalarLeaves(projected).keys());
  for (const [path, val] of rawLeaves) {
    if (projPaths.has(path)) continue; // retained by the projection → allowed
    if (typeof val === "string" && val.trim().length >= 8) sink.add(val.trim());
  }
}
function strippedInternalValues(): string[] {
  const rec = getCanonicalPeople() as any;
  const sink = new Set<string>();
  // crew: raw roster member (by code) vs its allowlist projection
  const projByCode = new Map(getPublicCrew().map((m) => [m.code, m]));
  for (const raw of rec.crew.roster as any[]) {
    const proj = projByCode.get(raw.code);
    if (proj) strippedBetween(raw, proj, sink);
  }
  // leadership: raw[i] vs projection[i]
  const projLead = getPublicLeadership();
  (rec.leadership as any[]).forEach((raw, i) => strippedBetween(raw, projLead[i] ?? {}, sink));
  // medical partner
  strippedBetween(rec.medicalPartner, getPublicMedicalPartner(), sink);
  return [...sink];
}

async function main() {
  console.log(`[team-render-parity] base=${BASE}`);

  const counts = getCrewCounts();
  const crew = getPublicCrew();
  const guides = getPublicGuides();
  const drivers = getPublicDrivers();
  const codes = getPublicCrewCodes();
  const unpublished = getUnpublishedCrewCodes();
  const faqs = buildTeamFaqs();
  const leakValues = strippedInternalValues();

  // ── 1–4. HUB ────────────────────────────────────────────────────────────────
  const hub = await get("/team");
  assert(hub.status === 200, `/team → 200 (got ${hub.status})`);
  const hubText = visibleText(hub.text);
  const hubLd = jsonLd(hub.text);

  assert(canonical(hub.text) === `${ORIGIN}/team`, `/team canonical = ${ORIGIN}/team`);

  // counts are the rendered truth
  assert(counts.total === 11 && counts.guides === 7 && counts.drivers === 4, "record counts 11/7/4");
  assert(
    hubText.includes(`${counts.total} active crew`) &&
      hubText.includes(`${counts.guides} guides`) &&
      hubText.includes(`${counts.drivers} drivers`),
    "hub header renders 11 active crew — 7 guides, 4 drivers",
  );
  assert(hubText.includes(`Licensed Guides (${guides.length})`), `hub shows "Licensed Guides (${guides.length})"`);
  assert(hubText.includes(`Drivers (${drivers.length})`), `hub shows "Drivers (${drivers.length})"`);

  // visible crew names == ItemList JSON-LD names == record
  const itemList = byType(hubLd, "ItemList")[0];
  assert(!!itemList, "hub emits ItemList JSON-LD");
  const ldNames: string[] = (itemList?.itemListElement ?? []).map((e: any) => e?.item?.name).filter(Boolean);
  assert(itemList?.numberOfItems === 11, `ItemList numberOfItems == 11 (got ${itemList?.numberOfItems})`);
  assert(ldNames.length === 11, `ItemList has 11 crew Person refs (got ${ldNames.length})`);
  const recNames = crew.map((m) => m.name);
  assert(JSON.stringify([...ldNames].sort()) === JSON.stringify([...recNames].sort()), "ItemList names == record crew names");
  for (const m of crew) {
    if (!hubText.includes(m.name)) bad(`crew '${m.name}' not visible on hub`);
    if (!ldNames.includes(m.name)) bad(`crew '${m.name}' missing from ItemList JSON-LD`);
  }
  ok("all 11 crew names appear BOTH in visible hub HTML and ItemList JSON-LD");

  // AboutPage cross-references org + founder + doctor
  const aboutPage = byType(hubLd, "AboutPage")[0];
  assert(!!aboutPage, "hub emits AboutPage JSON-LD");
  const aboutIds: string[] = (aboutPage?.about ?? []).map((a: any) => a?.["@id"]).filter(Boolean);
  assert(
    aboutIds.some((i) => i.endsWith("/#agung-sambuko")) && aboutIds.some((i) => i.endsWith("/#dr-ahmad-irwandanu")),
    "AboutPage.about cross-refs founder + doctor by @id",
  );

  // FAQ == record: visible questions == FAQPage JSON-LD == buildTeamFaqs()
  const faqPage = byType(hubLd, "FAQPage")[0];
  assert(!!faqPage, "hub emits exactly one FAQPage JSON-LD");
  assert(byType(hubLd, "FAQPage").length === 1, "single FAQPage on hub (no double emission)");
  const ldQuestions: string[] = (faqPage?.mainEntity ?? []).map((q: any) => q?.name).filter(Boolean);
  const recQuestions = faqs.map((f) => f.question);
  assert(JSON.stringify(ldQuestions) === JSON.stringify(recQuestions), "FAQPage questions == buildTeamFaqs() (order-exact)");
  for (const f of faqs) {
    if (!hubText.includes(f.question)) bad(`FAQ question not visible: "${f.question}"`);
    // answer text is record-derived; assert the FAQPage answer equals the record answer
    const node = (faqPage?.mainEntity ?? []).find((q: any) => q?.name === f.question);
    if (node?.acceptedAnswer?.text !== f.answer) bad(`FAQPage answer != record answer for "${f.question}"`);
  }
  ok("Team FAQ is record-derived (visible == FAQPage JSON-LD == buildTeamFaqs)");

  // leadership + medical partner render from projections
  for (const l of getPublicLeadership()) {
    if (l.name && !hubText.includes(l.name)) bad(`leadership '${l.name}' not visible on hub`);
  }
  const mp = getPublicMedicalPartner();
  if (mp?.name) assert(hubText.includes(mp.name), `medical partner '${mp.name}' visible on hub`);

  // no allowlist-stripped internal value leaks on the hub
  for (const v of leakValues) {
    if (hub.text.includes(v)) bad(`internal (allowlist-stripped) value leaked on hub HTML: ${JSON.stringify(v.slice(0, 48))}…`);
  }
  ok(`no internal (allowlist-stripped) value (${leakValues.length} checked) leaked on hub`);

  // ── 5. PROFILE PAGES (all 11) ─────────────────────────────────────────────────
  for (const code of codes) {
    const member = getPublicCrewByCode(code)!;
    const res = await get(`/team/${code}`);
    if (res.status !== 200) { bad(`/team/${code} → ${res.status} (want 200)`); continue; }
    const text = visibleText(res.text);
    const ld = jsonLd(res.text);
    if (canonical(res.text) !== `${ORIGIN}/team/${code}`) bad(`/team/${code} canonical wrong`);

    const profile = byType(ld, "ProfilePage")[0];
    const person = profile?.mainEntity;
    if (!person || person["@type"] !== "Person") { bad(`/team/${code} missing ProfilePage→Person`); continue; }

    // visible == JSON-LD: name
    if (person.name !== member.name) bad(`/team/${code} Person.name != record`);
    if (!text.includes(member.name)) bad(`/team/${code} name not visible`);

    // specialties (knowsAbout) + languages (knowsLanguage) match record + render
    const ldSpecialties: string[] = person.knowsAbout ?? [];
    if (JSON.stringify([...ldSpecialties].sort()) !== JSON.stringify([...member.specialties].sort()))
      bad(`/team/${code} knowsAbout != record specialties`);
    for (const s of member.specialties) if (!text.includes(s)) bad(`/team/${code} specialty '${s}' not visible`);
    const ldLangs: string[] = (person.knowsLanguage ?? []).map((x: any) => x?.name).filter(Boolean);
    if (JSON.stringify([...ldLangs].sort()) !== JSON.stringify([...member.languages].sort()))
      bad(`/team/${code} knowsLanguage != record languages`);

    // KTA is a MEMBERSHIP credential, never a government licence
    if (person.hasCredential?.credentialCategory !== "membership")
      bad(`/team/${code} KTA credentialCategory must be "membership"`);

    // no allowlist-stripped internal value leak on the profile
    for (const v of leakValues) if (res.text.includes(v)) bad(`/team/${code} leaked internal (allowlist-stripped) value`);
  }
  ok(`all ${codes.length} profile pages: 200 + canonical + visible==Person JSON-LD + KTA membership + no leak`);

  // ── 6. UNPUBLISHED PRODUCE NOTHING ────────────────────────────────────────────
  assert(unpublished.length >= 1, "record declares unpublished crew (yusuf/dika/pras)");
  for (const code of unpublished) {
    const res = await get(`/team/${code}`);
    assert(res.status === 404, `/team/${code} → 404 (unpublished, got ${res.status})`);
    if (hub.text.includes(`/team/${code}`)) bad(`hub links to unpublished /team/${code}`);
  }
  ok("unpublished crew produce no route (404) and no hub link");

  // ── 7+8. KNOWLEDGE FEED PEOPLE PROJECTION ─────────────────────────────────────
  const feed = await get("/api/knowledge-feed");
  assert(feed.status === 200, `/api/knowledge-feed → 200 (got ${feed.status})`);
  let feedJson: any = {};
  try { feedJson = JSON.parse(feed.text); } catch { bad("knowledge-feed not JSON"); }
  const p = feedJson.people ?? {};
  assert(
    p?.crew?.counts?.total === 11 && p?.crew?.counts?.guides === 7 && p?.crew?.counts?.drivers === 4,
    "feed people.crew.counts == 11/7/4",
  );
  const feedCodes: string[] = (p?.crew?.members ?? []).map((m: any) => m.code);
  assert(feedCodes.length === 11, `feed lists 11 crew members (got ${feedCodes.length})`);
  for (const u of unpublished) if (feedCodes.includes(u)) bad(`feed leaked unpublished crew '${u}'`);
  for (const v of leakValues) if (feed.text.includes(v)) bad(`feed leaked internal (allowlist-stripped) value: ${JSON.stringify(v.slice(0, 48))}…`);
  ok("knowledge feed: 11 public crew, no unpublished, no internal (allowlist-stripped) value leaked");

  if (fail) {
    console.error("[team-render-parity] FAIL");
    process.exit(1);
  }
  console.log("[team-render-parity] PASS");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
