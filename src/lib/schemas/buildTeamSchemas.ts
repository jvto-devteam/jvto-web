/**
 * Team cluster JSON-LD — built ENTIRELY from the canonical people projections
 * (src/lib/people/canonicalPeople.ts), so the emitted graph equals the visible
 * record: no Prisma, no employmentType, KTA rendered as an HPWKI MEMBERSHIP
 * credential (never a government licence), and no invented biography. Unpublished
 * crew are absent because the projections never return them.
 *
 *   /why-jvto/our-team          → AboutPage + ItemList(11 crew) + FAQPage
 *   /why-jvto/our-team/[slug]   → ProfilePage + Person
 */
import type {
  AboutPage,
  ImageObject,
  ItemList,
  Person,
  ProfilePage,
  WithContext,
} from "schema-dts";

import type { PublicCrewMember } from "@/lib/people/canonicalPeople";

const BASE = "https://javavolcano-touroperator.com";
const ORG_ID = `${BASE}/#organization`;
const FOUNDER_ID = `${BASE}/#agung-sambuko`;
const DOCTOR_ID = `${BASE}/#dr-ahmad-irwandanu`;

/**
 * Role → public job-title label. A plain role label, NOT a credential claim: the
 * canonical record establishes only an HPWKI MEMBERSHIP credential (KTA), never a
 * government/professional licence, so we must not label crew "Licensed" (the page
 * itself states the KTA is not a government licence).
 */
export function crewJobTitle(role: "guide" | "driver"): string {
  return role === "guide" ? "Tour Guide" : "Tour Driver";
}

function imageObject(member: PublicCrewMember): ImageObject {
  return {
    "@type": "ImageObject",
    url: `${BASE}${member.image.src}`,
    caption: member.image.alt,
  };
}

/** One crew Person node (used as the ProfilePage mainEntity). */
export function buildCrewPersonNode(member: PublicCrewMember): Person {
  return {
    "@type": "Person",
    "@id": `${BASE}/#crew-${member.code}`,
    name: member.name,
    jobTitle: crewJobTitle(member.role),
    url: `${BASE}/why-jvto/our-team/${member.code}`,
    worksFor: { "@id": ORG_ID },
    knowsLanguage: member.languages.map((name) => ({ "@type": "Language", name })),
    knowsAbout: member.specialties,
    // KTA is an HPWKI MEMBERSHIP credential — credentialCategory "membership",
    // never "licence". Both guides and drivers hold it (confirmed in the record).
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: member.kta.credentialType,
      identifier: member.kta.id,
      credentialCategory: "membership",
      recognizedBy: { "@type": "Organization", name: member.kta.issuer },
    },
    image: imageObject(member),
  };
}

/** One guest review that names this crew member, as a schema.org Review. */
export type CrewReviewForSchema = {
  permalinkId: number | null;
  reviewerName: string;
  date: string;
  star: number;
  reviewExcerpt: string;
};

/**
 * /why-jvto/our-team/[slug] — ProfilePage wrapping the crew Person.
 *
 * The page renders guest reviews that name this person, but the graph carried
 * only the Person node, so the reviews were visible to readers and invisible
 * to machines — the strongest asset on the page, unreadable in the layer that
 * reads it (T-10, 2026-08-20 audit). The reviews are attached as Review nodes
 * on the Person, each pointing at the permalink we host rather than the
 * merchant-console link the source data carries.
 */
export function buildTeamProfileSchema(
  member: PublicCrewMember,
  reviews: CrewReviewForSchema[] = [],
): WithContext<ProfilePage> {
  const person = buildCrewPersonNode(member);
  const reviewNodes = reviews
    .filter((review) => review.reviewExcerpt?.trim())
    .map((review) => ({
      "@type": "Review" as const,
      ...(review.permalinkId
        ? {
            "@id": `${BASE}/why-jvto/reviews/${review.permalinkId}#crew-${member.code}`,
            url: `${BASE}/why-jvto/reviews/${review.permalinkId}`,
          }
        : {}),
      author: { "@type": "Person" as const, name: review.reviewerName },
      datePublished: review.date,
      reviewBody: review.reviewExcerpt,
      reviewRating: {
        "@type": "Rating" as const,
        ratingValue: String(review.star),
        bestRating: "5",
        worstRating: "1",
      },
      itemReviewed: { "@id": ORG_ID },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE}/why-jvto/our-team/${member.code}#profilepage`,
    url: `${BASE}/why-jvto/our-team/${member.code}`,
    name: `${member.name} — JVTO ${crewJobTitle(member.role)}`,
    about: { "@id": ORG_ID },
    // schema-dts types Person as a union, so it cannot be spread directly.
    mainEntity: reviewNodes.length
      ? ({
          ...(person as unknown as Record<string, unknown>),
          review: reviewNodes,
        } as unknown as Person)
      : person,
  };
}

/** /why-jvto/our-team — ItemList of the published crew (lightweight Person refs). */
export function buildTeamItemListSchema(crew: PublicCrewMember[]): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE}/why-jvto/our-team#crew-index`,
    name: "JVTO Field Crew — East Java",
    description:
      "Complete registry of JVTO's directly-managed East Java field crew: guides and drivers on Bromo, Ijen, and Tumpak Sewu tours.",
    numberOfItems: crew.length,
    itemListElement: crew.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@id": `${BASE}/#crew-${m.code}`,
        "@type": "Person",
        name: m.name,
        url: `${BASE}/why-jvto/our-team/${m.code}`,
      },
    })),
  };
}

/** /why-jvto/our-team — AboutPage: the team page, cross-referencing org + founder + doctor by @id. */
export function buildTeamAboutPageSchema(): WithContext<AboutPage> {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE}/why-jvto/our-team#aboutpage`,
    url: `${BASE}/why-jvto/our-team`,
    name: "JVTO Field Team — Guides, Drivers, Leadership & Medical Screening",
    about: [{ "@id": ORG_ID }, { "@id": FOUNDER_ID }, { "@id": DOCTOR_ID }],
    mainEntity: { "@id": `${BASE}/why-jvto/our-team#crew-index` },
  };
}
