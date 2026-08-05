/**
 * Zod contracts for the static-content SSOT (public-content migration, PACKAGE 01).
 *
 * These schemas are the validation gate for everything under `content/`
 * (pages, faqs, entities). Blueprint §5.5. They deliberately mirror the
 * CURRENT `BlocksRenderer` block union (src/components/content/BlocksRenderer.tsx)
 * so structured pages migrate without a new block system (AD-11).
 *
 * NOTE: content facts are additionally policed by scripts/validate-content-drift.mjs
 * (docs/CANONICAL_FACTS.md lock), which scans `content/` — these schemas check
 * structure, the drift scanner checks facts.
 */
import { z } from "zod";

/** Allowed page sections (AD-01 surface). Extend only with an owner decision. */
export const SectionSchema = z.enum([
  "policy",
  "travel-guide",
  "why-jvto",
  "verify-jvto",
  "destinations",
  "team",
  "blog",
]);

/** Allowed schema.org types (AD editors must not enter arbitrary type names). */
export const SchemaTypeSchema = z.enum([
  "WebPage",
  "AboutPage",
  "CollectionPage",
  "FAQPage",
  "ProfilePage",
  "Article",
  "BlogPosting",
  "TouristAttraction",
]);

export const OwnerSchema = z.enum([
  "company",
  "legal",
  "operations",
  "editorial",
]);

/** `/` or `/seg/seg2` — lowercase, no trailing slash (AD-06). */
export const RouteSchema = z
  .string()
  .regex(
    /^\/$|^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/,
    "route must start with '/', use lowercase a-z0-9- segments, no trailing slash",
  );

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/**
 * YYYY-MM-DD, as a STRING. loadMarkdownPage parses frontmatter with the YAML
 * 1.2 CORE schema so unquoted dates stay strings — never accept a JS Date
 * here: YAML 1.1 timestamp parsing rolls impossible dates (2026-13-45) into
 * "valid" ones before validation could catch them.
 */
export const IsoDateSchema = z
  .string()
  .regex(ISO_DATE_RE, "must be YYYY-MM-DD")
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, "must be a real calendar date (YYYY-MM-DD)");

export const FaqKeySchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "faqKey must be lowercase a-z0-9-");

export const PageMetaSchema = z.object({
  route: RouteSchema,
  title: z.string().min(1, "title is required"),
  /** Optional browser-tab/SEO <title> override when it differs from the H1 (parity with legacy pages). */
  browserTitle: z.string().min(1).optional(),
  description: z.string().min(1, "description is required"),
  section: SectionSchema,
  status: z.enum(["draft", "published"]),
  owner: OwnerSchema,
  lastReviewed: IsoDateSchema,
  schemaTypes: z.array(SchemaTypeSchema).min(1).default(["WebPage"]),
  faqKey: FaqKeySchema.optional(),
  summary: z.string().min(1, "summary is required"),
});
export type PageMeta = z.infer<typeof PageMetaSchema>;

/* ------------------------------------------------------------------ */
/* Structured blocks — MUST stay compatible with BlocksRenderer        */
/* (markdown | image | grid | crew_grid). Extra keys are allowed so    */
/* current seed shapes migrate losslessly; critical fields are strict. */
/* ------------------------------------------------------------------ */

export const MarkdownBlockSchema = z
  .looseObject({
    type: z.literal("markdown"),
    body_md: z.string().min(1, "markdown block needs body_md"),
  });

export const ImageBlockSchema = z
  .looseObject({
    type: z.literal("image"),
    src: z.string().min(1, "image block needs src"),
    alt: z.string().min(1, "image block needs alt text"),
  });

export const GridBlockSchema = z
  .looseObject({
    type: z.literal("grid"),
    items: z.array(z.looseObject({})).min(1, "grid block needs items"),
  });

export const CrewGridBlockSchema = z
  .looseObject({
    type: z.literal("crew_grid"),
  });

export const BlockSchema = z.discriminatedUnion("type", [
  MarkdownBlockSchema,
  ImageBlockSchema,
  GridBlockSchema,
  CrewGridBlockSchema,
]);
export type Block = z.infer<typeof BlockSchema>;

export const StructuredSectionSchema = z
  .looseObject({
    id: z.string().regex(/^[a-z0-9-]+$/, "section id must be lowercase a-z0-9-"),
    title: z.string().optional(),
    blocks: z.array(BlockSchema).optional(),
    body_md: z.string().optional(),
  })
  .refine(
    (s) => (s.blocks && s.blocks.length > 0) || (s.body_md && s.body_md.length > 0),
    "section needs blocks or body_md",
  );
export type StructuredSection = z.infer<typeof StructuredSectionSchema>;

export const StructuredPageSchema = z
  .object({
    meta: PageMetaSchema,
    lede: z.array(z.string().min(1)).optional(),
    sections: z.array(StructuredSectionSchema).min(1),
  })
  .superRefine((page, ctx) => {
    const seen = new Set<string>();
    for (const sec of page.sections) {
      if (seen.has(sec.id)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate section id "${sec.id}"`,
          path: ["sections"],
        });
      }
      seen.add(sec.id);
    }
  });
export type StructuredPageDocument = z.infer<typeof StructuredPageSchema>;

/* ------------------------------------------------------------------ */
/* FAQ — one object feeds both visible HTML and FAQPage JSON-LD (AD-08) */
/* ------------------------------------------------------------------ */

export const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

export const FaqSetSchema = z.object({
  key: FaqKeySchema,
  items: z.array(FaqItemSchema).min(1),
});
export type FaqSet = z.infer<typeof FaqSetSchema>;

/* ------------------------------------------------------------------ */
/* Entities — stable cross-page facts (AD-03). PACKAGE 02 adds the     */
/* per-entity strict schemas; the base contract requires lastReviewed. */
/* ------------------------------------------------------------------ */

export const EntityDocumentSchema = z
  .looseObject({
    lastReviewed: IsoDateSchema,
  });
export type EntityDocument = z.infer<typeof EntityDocumentSchema>;

const YearSchema = z.string().regex(/^\d{4}$/, "must be a 4-digit year");
const Sha256Schema = z.string().regex(/^[0-9a-f]{64}$/, "must be a lowercase hex SHA-256");

export const OrganizationEntitySchema = z.looseObject({
  legalName: z.string().min(1),
  brandName: z.string().min(1),
  websiteUrl: z.url(),
  telephone: z.string().regex(/^\+\d{8,15}$/, "must be E.164-style (+digits)"),
  email: z.email(),
  foundingDate: YearSchema,
  address: z.looseObject({
    streetAddress: z.string().min(1),
    addressLocality: z.string().min(1),
    addressRegion: z.string().min(1),
    postalCode: z.string().min(1),
    addressCountry: z.string().length(2),
  }),
  identifiers: z
    .array(z.looseObject({ type: z.string().min(1), value: z.string().min(1) }))
    .min(1),
  lastReviewed: IsoDateSchema,
});

export const CredentialsEntitySchema = z.looseObject({
  credentials: z
    .array(
      z.looseObject({
        key: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        category: z.string().min(1),
        recognizedBy: z.string().min(1),
        sha256: Sha256Schema.optional(),
        documentUrl: z.url().optional(),
        dateIssued: IsoDateSchema.optional(),
      }),
    )
    .min(1),
  lastReviewed: IsoDateSchema,
});

/** One canonical crew member (operational). KTA is an HPWKI MEMBERSHIP credential — never a licence. */
const CrewMemberSchema = z.looseObject({
  code: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  role: z.enum(["guide", "driver"]),
  languages: z.array(z.string().min(1)).min(1),
  specialties: z.array(z.string().min(1)).min(1),
  kta: z.looseObject({
    id: z.string().regex(/^KTA-[GD]-\d{4}-\d{3}$/, "KTA id must be KTA-G/D-YYYY-NNN"),
    credentialType: z.string().min(1),
    issuer: z.string().min(1),
    credentialState: z.enum(["confirmed", "pending"]),
  }),
  image: z.looseObject({ src: z.string().min(1), alt: z.string().min(1) }),
});

export const PeopleEntitySchema = z
  .looseObject({
    lastReviewed: IsoDateSchema,
    disclaimer: z.looseObject({
      policeIndependence: z.string().min(1),
      directManagedCrew: z.string().min(1),
    }),
    leadership: z
      .array(
        z.looseObject({
          id: z.string().min(1),
          name: z.string().min(1),
          relationship: z.literal("leadership"),
          roles: z.array(z.string().min(1)).min(1),
          countsAsCrew: z.literal(false),
        }),
      )
      .min(1),
    medicalPartner: z.looseObject({
      id: z.string().min(1),
      name: z.string().min(1),
      relationship: z.string().min(1),
      credentials: z.looseObject({ str: z.string().min(1), strValidTo: IsoDateSchema }),
      claimBoundary: z.string().min(1),
      countsAsCrew: z.literal(false),
    }),
    crew: z.looseObject({
      total: z.int().positive(),
      guides: z.int().positive(),
      drivers: z.int().positive(),
      roster: z.array(CrewMemberSchema).min(1),
    }),
  })
  .superRefine((p, ctx) => {
    const c = p.crew;
    if (c.guides + c.drivers !== c.total)
      ctx.addIssue({ code: "custom", message: "crew.total must equal guides + drivers", path: ["crew"] });
    if (c.roster.length !== c.total)
      ctx.addIssue({ code: "custom", message: `roster length ${c.roster.length} != crew.total ${c.total}`, path: ["crew", "roster"] });
    const g = c.roster.filter((r) => r.role === "guide").length;
    const d = c.roster.filter((r) => r.role === "driver").length;
    if (g !== c.guides)
      ctx.addIssue({ code: "custom", message: `roster has ${g} guides but crew.guides = ${c.guides}`, path: ["crew", "roster"] });
    if (d !== c.drivers)
      ctx.addIssue({ code: "custom", message: `roster has ${d} drivers but crew.drivers = ${c.drivers}`, path: ["crew", "roster"] });
  });

export const PartnersEntitySchema = z.looseObject({
  partners: z
    .array(
      z.looseObject({
        key: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        relationship: z.string().min(1),
        // OKF working contract: every partner record carries its claim boundary.
        claimBoundary: z.string().min(1),
      }),
    )
    .min(1),
  lastReviewed: IsoDateSchema,
});

export const ReviewPlatformsEntitySchema = z
  .looseObject({
    platforms: z.object({
      trustpilot: z.int().positive(),
      google: z.int().positive(),
      tripadvisor: z.int().positive(),
    }),
    average_rating: z.number().min(1).max(5),
    profiles: z
      .array(
        z.looseObject({
          platform: z.string().min(1),
          rating: z.number().min(1).max(5).nullable(),
          reviewCount: z.int().positive().nullable(),
          profileUrl: z.url(),
          verifiedAt: IsoDateSchema.nullable(),
          isPrimary: z.boolean(),
        }),
      )
      .min(1),
    lastReviewed: IsoDateSchema,
  })
  .superRefine((doc, ctx) => {
    // A rating is never presented without a verification date (blueprint §Package 02).
    for (const p of doc.profiles) {
      if (p.rating != null && p.verifiedAt == null) {
        ctx.addIssue({
          code: "custom",
          message: `profile "${p.platform}" has a rating but no verifiedAt`,
          path: ["profiles"],
        });
      }
    }
    if (doc.profiles.filter((p) => p.isPrimary).length !== 1) {
      ctx.addIssue({ code: "custom", message: "exactly one profile must be isPrimary", path: ["profiles"] });
    }
    // The machine-readable counts map and the profiles must agree.
    const byName: Record<string, number> = {
      Trustpilot: doc.platforms.trustpilot,
      "Google Maps": doc.platforms.google,
      TripAdvisor: doc.platforms.tripadvisor,
    };
    for (const [name, count] of Object.entries(byName)) {
      const profile = doc.profiles.find((p) => p.platform === name);
      if (!profile) {
        ctx.addIssue({ code: "custom", message: `platforms map names "${name}" but profiles has no such platform`, path: ["profiles"] });
      } else if (profile.reviewCount !== count) {
        ctx.addIssue({
          code: "custom",
          message: `count mismatch for "${name}": platforms map says ${count}, profile says ${profile.reviewCount}`,
          path: ["profiles"],
        });
      }
    }
  });

export const NarrativeClaimsEntitySchema = z.looseObject({
  claims: z
    .array(
      z.looseObject({
        id: z.string().regex(/^C[1-9]$/),
        pillar: z.string().min(1),
        primary_page: RouteSchema.optional(),
      }),
    )
    .min(9),
  lastReviewed: IsoDateSchema,
});

/** Strict schema per known entity file name — validate.ts applies these on top of the base contract. */
export const ENTITY_SCHEMAS: Record<string, z.ZodType> = {
  organization: OrganizationEntitySchema,
  credentials: CredentialsEntitySchema,
  people: PeopleEntitySchema,
  partners: PartnersEntitySchema,
  "review-platforms": ReviewPlatformsEntitySchema,
  "narrative-claims": NarrativeClaimsEntitySchema,
};

/* ------------------------------------------------------------------ */
/* Content-quality rules used by the validator (not pure shape checks) */
/* ------------------------------------------------------------------ */

/** Placeholder text that must never ship on a published page. */
export const PLACEHOLDER_RE = /\b(?:TODO|TBD|FIXME|XXX)\b|Lorem ipsum/i;

/**
 * True when a Markdown body contains a level-one heading (AD-07 violation).
 * Fenced code blocks are stripped first so `# comment` inside ``` fences
 * doesn't false-positive.
 */
export function markdownHasH1(body: string): boolean {
  const withoutFences = body.replace(/```[\s\S]*?```/g, "");
  return /^#(?!#)\s?/m.test(withoutFences);
}

/** Extract internal link targets (`](/path...)`) from a Markdown body. */
export function extractInternalLinks(body: string): string[] {
  const out: string[] = [];
  const re = /\]\((\/[^)\s#?]*)(?:[^)]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) out.push(m[1]);
  return out;
}
