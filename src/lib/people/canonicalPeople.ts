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
export interface LeadershipMember {
  id: string;
  name: string;
  roles: string[];
  countsAsCrew: false;
  [k: string]: unknown;
}
export interface MedicalPartner {
  id: string;
  name: string;
  countsAsCrew: false;
  [k: string]: unknown;
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
  review: string[];
  doNotPublish: string[];
} {
  const rec = getCanonicalPeople() as any;
  const a = rec.publicFieldAllowlist ?? {};
  return {
    crew: Array.isArray(a.crew) ? a.crew : [],
    review: Array.isArray(a.review) ? a.review : [],
    doNotPublish: Array.isArray(a.doNotPublish) ? a.doNotPublish : [],
  };
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

export function getLeadership(): LeadershipMember[] {
  return getCanonicalPeople().leadership as unknown as LeadershipMember[];
}

export function getMedicalPartner(): MedicalPartner {
  return getCanonicalPeople().medicalPartner as unknown as MedicalPartner;
}

export function getDisclaimer(): { policeIndependence: string; directManagedCrew: string } {
  return getCanonicalPeople().disclaimer;
}
