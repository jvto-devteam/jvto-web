/**
 * Canonical people reader — the single DB-free accessor for the JVTO people
 * trust graph. Source: jvto-ekosistem
 * (1-knowledge-and-evidence-core/people-and-crew/people.json), fetched via
 * @/lib/ecosystemContent/people — replaces the local copy that used to live
 * at content/entities/people.json in this repo, so there is exactly one
 * place crew/leadership data is edited. The Team routes (/team,
 * /team/[slug]), their JSON-LD + metadata + FAQ, and the knowledge-feed people
 * projection read people ONLY through here. No Prisma, no content_pages.
 *
 * Privacy is enforced structurally, from the record itself:
 *   - `crew.unpublished` members (e.g. KTA-pending) are NEVER returned by any
 *     public accessor — they resolve to null and produce no route/JSON-LD/feed;
 *   - a public crew member is projected to EXACTLY the fields in
 *     `publicFieldAllowlist.crew`, so internal-only fields (kta.evidenceSource,
 *     kta.reviewedDate) and anything in `publicFieldAllowlist.doNotPublish`
 *     cannot leak into HTML / JSON-LD / metadata / feed.
 *
 * Facts preserved: 11 operational crew (7 guides + 4 drivers); leadership and
 * the medical partner are NOT counted as crew; KTA is an HPWKI membership
 * credential (never a government licence); crew are direct-managed (never
 * "employee"/"full-time"). No biography/relationship/credential is invented —
 * a profile with no verified public biography simply exposes the fields present.
 *
 * Every accessor here is async (ecosystem read is I/O) — this changed when
 * the source moved from a local readFileSync to jvto-ekosistem. Callers must
 * await.
 */
import { getEcosystemPeopleRecord } from "@/lib/ecosystemContent/people";
import { PeopleEntitySchema } from "@/lib/static-content/schemas";

// ── Public projection types (exactly publicFieldAllowlist.crew) ───────────────

export interface PublicKta {
  id: string;
  credentialType: string; // "HPWKI membership credential (KTA)" — never a licence
  issuer: string;
  credentialState: "confirmed" | "pending";
}
export interface PublicCrewMember {
  code: string;
  name: string;
  role: "guide" | "driver";
  languages: string[];
  specialties: string[];
  kta: PublicKta;
  image: { src: string; alt: string };
}
export interface PublicLeadership {
  id: string;
  name: string;
  alternateNames?: string[];
  relationship?: string;
  roles: string[];
  background?: string;
  memberOf?: string;
}
export interface PublicMedicalPartner {
  id: string;
  name: string;
  relationship?: string;
  jobTitle?: string;
  role?: string;
  claimBoundary?: string;
  credentials?: {
    sip?: string;
    sipIssuer?: string;
    str?: string;
    strValidTo?: string;
    facility?: string;
    verifiableVia?: string;
    verificationUrls?: string[];
  };
}
export interface CrewCounts {
  total: number;
  guides: number;
  drivers: number;
}

type PeopleRecord = ReturnType<typeof PeopleEntitySchema.parse>;

// ── Load + validate once per process, memoized as a promise ───────────────────

let cachedPromise: Promise<PeopleRecord> | null = null;

/** The full validated canonical record. Rejects if ekosistem is unreachable or the record is invalid. */
export function getCanonicalPeople(): Promise<PeopleRecord> {
  if (!cachedPromise) {
    cachedPromise = getEcosystemPeopleRecord<unknown>().then((raw) => {
      if (!raw) {
        cachedPromise = null; // allow retry on next call instead of caching a permanent failure
        throw new Error(
          "canonicalPeople: could not read people.json from jvto-ekosistem (local sibling dir and HTTP fetch both failed)",
        );
      }
      return PeopleEntitySchema.parse(raw); // schema enforces 11 = 7 + 4, roster tallies
    });
  }
  return cachedPromise;
}

// ── The allowlist projection (the ONLY way a crew member becomes public) ──────

/**
 * Project one raw roster member to EXACTLY the fields declared in
 * `publicFieldAllowlist.crew` — derived from that list, never hardcoded, so it
 * can never drift from the declared allowlist (removing a path drops it from
 * output; adding one includes it). Any field not listed (e.g. kta.evidenceSource,
 * kta.reviewedDate) is dropped, so it can never reach the DOM / JSON-LD / feed.
 * canonical-people-selftest.ts asserts the projected leaf paths equal the
 * allowlist exactly (both directions, incl. image subpaths).
 */
function projectPublicCrew(raw: Record<string, any>, allowlist: string[]): PublicCrewMember {
  return pickAllowlist(raw, allowlist) as unknown as PublicCrewMember;
}

/** The public field allowlist as declared in the record (data-driven privacy). */
export async function getPublicFieldAllowlist(): Promise<{
  crew: string[];
  leadership: string[];
  medicalPartner: string[];
  review: string[];
  doNotPublish: string[];
}> {
  const rec = (await getCanonicalPeople()) as any;
  const a = rec.publicFieldAllowlist ?? {};
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return {
    crew: arr(a.crew),
    leadership: arr(a.leadership),
    medicalPartner: arr(a.medicalPartner),
    review: arr(a.review),
    doNotPublish: arr(a.doNotPublish),
  };
}

/**
 * Project an object to EXACTLY the allowlisted paths. Supports one level of
 * dot-nesting (e.g. "credentials.sip"). Any field not listed is dropped — so
 * evidence / namingRule / source notes / reviewedDate / lastVerified never reach
 * the DOM / JSON-LD / feed.
 */
function pickAllowlist(src: Record<string, any>, paths: string[]): Record<string, any> {
  const clone = (v: unknown) => (v == null ? v : JSON.parse(JSON.stringify(v)));
  const out: Record<string, any> = {};
  for (const p of paths) {
    const dot = p.indexOf(".");
    if (dot === -1) {
      if (src[p] !== undefined) out[p] = clone(src[p]);
    } else {
      const top = p.slice(0, dot);
      const sub = p.slice(dot + 1);
      if (src[top] && typeof src[top] === "object" && src[top][sub] !== undefined) {
        out[top] = out[top] ?? {};
        out[top][sub] = clone(src[top][sub]);
      }
    }
  }
  return out;
}

/** Codes that must NEVER be public (crew.unpublished). */
export async function getUnpublishedCrewCodes(): Promise<string[]> {
  const rec = (await getCanonicalPeople()) as any;
  const u = rec.crew?.unpublished;
  return Array.isArray(u) ? u.map((m: any) => m.code) : [];
}

// ── Public accessors (never expose unpublished / non-allowlisted fields) ──────

/** All PUBLISHED operational crew (11), allowlist-projected, in roster order. */
export async function getPublicCrew(): Promise<PublicCrewMember[]> {
  const rec = (await getCanonicalPeople()) as any;
  const [unpublishedCodes, allowlist] = await Promise.all([
    getUnpublishedCrewCodes(),
    getPublicFieldAllowlist(),
  ]);
  const unpublished = new Set(unpublishedCodes);
  return (rec.crew.roster as Record<string, any>[])
    .filter((m) => !unpublished.has(m.code)) // defensive: roster never contains unpublished
    .map((m) => projectPublicCrew(m, allowlist.crew));
}

export async function getPublicGuides(): Promise<PublicCrewMember[]> {
  return (await getPublicCrew()).filter((m) => m.role === "guide");
}
export async function getPublicDrivers(): Promise<PublicCrewMember[]> {
  return (await getPublicCrew()).filter((m) => m.role === "driver");
}

/** A single PUBLISHED crew member by code, or null (unpublished/unknown → null). */
export async function getPublicCrewByCode(code: string): Promise<PublicCrewMember | null> {
  const unpublishedCodes = await getUnpublishedCrewCodes();
  if (unpublishedCodes.includes(code)) return null;
  const crew = await getPublicCrew();
  return crew.find((m) => m.code === code) ?? null;
}

/** Codes that DO produce a public /team/[slug] route (published crew only). */
export async function getPublicCrewCodes(): Promise<string[]> {
  return (await getPublicCrew()).map((m) => m.code);
}

export async function getCrewCounts(): Promise<CrewCounts> {
  const c = (await getCanonicalPeople()).crew as any;
  return { total: c.total, guides: c.guides, drivers: c.drivers };
}

/** Leadership (Founder / Ops-Safety), projected to publicFieldAllowlist.leadership. */
export async function getPublicLeadership(): Promise<PublicLeadership[]> {
  const [allow, rec] = await Promise.all([getPublicFieldAllowlist(), getCanonicalPeople()]);
  return (rec.leadership as unknown as Record<string, any>[]).map(
    (l) => pickAllowlist(l, allow.leadership) as unknown as PublicLeadership,
  );
}

/** Medical-screening partner, projected to publicFieldAllowlist.medicalPartner. */
export async function getPublicMedicalPartner(): Promise<PublicMedicalPartner> {
  const [allow, rec] = await Promise.all([getPublicFieldAllowlist(), getCanonicalPeople()]);
  return pickAllowlist(
    rec.medicalPartner as unknown as Record<string, any>,
    allow.medicalPartner,
  ) as unknown as PublicMedicalPartner;
}

export async function getDisclaimer(): Promise<{ policeIndependence: string; directManagedCrew: string }> {
  return (await getCanonicalPeople()).disclaimer;
}
