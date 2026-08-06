/**
 * Canonical people reader — the single DB-free accessor for the JVTO people
 * trust graph (content/entities/people.json). The Team routes (/team,
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
 */
import { readFileSync } from "node:fs";
import path from "node:path";
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

// ── Load + validate once (fs-only; deterministic across a build) ──────────────

let cached: PeopleRecord | null = null;

function peopleFilePath(): string {
  return path.join(process.cwd(), "content", "entities", "people.json");
}

/** The full validated canonical record. Throws if the file is missing/invalid. */
export function getCanonicalPeople(): PeopleRecord {
  if (cached) return cached;
  const raw = JSON.parse(readFileSync(peopleFilePath(), "utf8"));
  const parsed = PeopleEntitySchema.parse(raw); // schema enforces 11 = 7 + 4, roster tallies
  cached = parsed;
  return parsed;
}

// ── The allowlist projection (the ONLY way a crew member becomes public) ──────

/**
 * Project one raw roster member to exactly the public-allowlisted fields. Any
 * field not listed here (e.g. kta.evidenceSource, kta.reviewedDate) is dropped,
 * so it can never reach the DOM / JSON-LD / feed. Keep this in sync with
 * `publicFieldAllowlist.crew` — assertPublicProjectionMatchesAllowlist() proves it.
 */
function projectPublicCrew(raw: Record<string, any>): PublicCrewMember {
  return {
    code: raw.code,
    name: raw.name,
    role: raw.role,
    languages: [...raw.languages],
    specialties: [...raw.specialties],
    kta: {
      id: raw.kta.id,
      credentialType: raw.kta.credentialType,
      issuer: raw.kta.issuer,
      credentialState: raw.kta.credentialState,
    },
    image: { src: raw.image.src, alt: raw.image.alt },
  };
}

/** The public field allowlist as declared in the record (data-driven privacy). */
export function getPublicFieldAllowlist(): {
  crew: string[];
  leadership: string[];
  medicalPartner: string[];
  review: string[];
  doNotPublish: string[];
} {
  const rec = getCanonicalPeople() as any;
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
export function getUnpublishedCrewCodes(): string[] {
  const rec = getCanonicalPeople() as any;
  const u = rec.crew?.unpublished;
  return Array.isArray(u) ? u.map((m: any) => m.code) : [];
}

// ── Public accessors (never expose unpublished / non-allowlisted fields) ──────

/** All PUBLISHED operational crew (11), allowlist-projected, in roster order. */
export function getPublicCrew(): PublicCrewMember[] {
  const rec = getCanonicalPeople() as any;
  const unpublished = new Set(getUnpublishedCrewCodes());
  return (rec.crew.roster as Record<string, any>[])
    .filter((m) => !unpublished.has(m.code)) // defensive: roster never contains unpublished
    .map(projectPublicCrew);
}

export function getPublicGuides(): PublicCrewMember[] {
  return getPublicCrew().filter((m) => m.role === "guide");
}
export function getPublicDrivers(): PublicCrewMember[] {
  return getPublicCrew().filter((m) => m.role === "driver");
}

/** A single PUBLISHED crew member by code, or null (unpublished/unknown → null). */
export function getPublicCrewByCode(code: string): PublicCrewMember | null {
  if (getUnpublishedCrewCodes().includes(code)) return null;
  return getPublicCrew().find((m) => m.code === code) ?? null;
}

/** Codes that DO produce a public /team/[slug] route (published crew only). */
export function getPublicCrewCodes(): string[] {
  return getPublicCrew().map((m) => m.code);
}

export function getCrewCounts(): CrewCounts {
  const c = getCanonicalPeople().crew;
  return { total: c.total, guides: c.guides, drivers: c.drivers };
}

/** Leadership (Founder / Ops-Safety), projected to publicFieldAllowlist.leadership. */
export function getPublicLeadership(): PublicLeadership[] {
  const allow = getPublicFieldAllowlist().leadership;
  return (getCanonicalPeople().leadership as unknown as Record<string, any>[]).map(
    (l) => pickAllowlist(l, allow) as unknown as PublicLeadership,
  );
}

/** Medical-screening partner, projected to publicFieldAllowlist.medicalPartner. */
export function getPublicMedicalPartner(): PublicMedicalPartner {
  const allow = getPublicFieldAllowlist().medicalPartner;
  return pickAllowlist(
    getCanonicalPeople().medicalPartner as unknown as Record<string, any>,
    allow,
  ) as unknown as PublicMedicalPartner;
}

export function getDisclaimer(): { policeIndependence: string; directManagedCrew: string } {
  return getCanonicalPeople().disclaimer;
}
