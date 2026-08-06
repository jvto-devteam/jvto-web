/**
 * Team cluster JSON-LD — built ENTIRELY from the canonical people projections
 * (src/lib/people/canonicalPeople.ts), so the emitted graph equals the visible
 * record: no Prisma, no employmentType, KTA rendered as an HPWKI MEMBERSHIP
 * credential (never a government licence), and no invented biography. Unpublished
 * crew are absent because the projections never return them.
 *
 *   /team          → AboutPage + ItemList(11 crew) + FAQPage
 *   /team/[slug]    → ProfilePage + Person
 */
import type { PublicCrewMember } from "@/lib/people/canonicalPeople";
import type { TeamFaq } from "@/lib/people/teamFaqs";

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

function imageObject(member: PublicCrewMember) {
  return {
    "@type": "ImageObject",
    url: `${BASE}${member.image.src}`,
    caption: member.image.alt,
  };
}

/** One crew Person node (used as the ProfilePage mainEntity). */
export function buildCrewPersonNode(member: PublicCrewMember) {
  return {
    "@type": "Person",
    "@id": `${BASE}/#crew-${member.code}`,
    name: member.name,
    jobTitle: crewJobTitle(member.role),
    url: `${BASE}/team/${member.code}`,
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

/** /team/[slug] — ProfilePage wrapping the crew Person. */
export function buildTeamProfileSchema(member: PublicCrewMember) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE}/team/${member.code}#profilepage`,
    url: `${BASE}/team/${member.code}`,
    name: `${member.name} — JVTO ${crewJobTitle(member.role)}`,
    about: { "@id": ORG_ID },
    mainEntity: buildCrewPersonNode(member),
  };
}

/** /team — ItemList of the published crew (lightweight Person refs). */
export function buildTeamItemListSchema(crew: PublicCrewMember[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE}/team#crew-index`,
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
        url: `${BASE}/team/${m.code}`,
      },
    })),
  };
}

/** /team — AboutPage: the team page, cross-referencing org + founder + doctor by @id. */
export function buildTeamAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE}/team#aboutpage`,
    url: `${BASE}/team`,
    name: "JVTO Field Team — Guides, Drivers, Leadership & Medical Screening",
    about: [{ "@id": ORG_ID }, { "@id": FOUNDER_ID }, { "@id": DOCTOR_ID }],
    mainEntity: { "@id": `${BASE}/team#crew-index` },
  };
}

/** FAQPage from the record-derived Team FAQ (same output the page renders). */
export function buildTeamFaqSchema(faqs: TeamFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE}/team#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
