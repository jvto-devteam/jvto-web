export type EcosystemLink = {
  group: "Core" | "Proof & Transparency" | "Related";
  title: string;
  description: string;
  href: string;
};

export const WHY_JVTO_ECOSYSTEM_LINKS: EcosystemLink[] = [
  // Core
  {
    group: "Core",
    title: "Why JVTO (Hub)",
    description: "Overview: operational certainty and the trust stack.",
    href: "/why-jvto",
  },
  {
    group: "Core",
    title: "Our Story",
    description: "Timeline, police-led culture, and the origin narrative.",
    href: "/why-jvto/our-story",
  },
  {
    group: "Core",
    title: "The JVTO Difference",
    description: "The pillars: legitimacy, transparency, private-only execution, safety innovation, local pathways, fair pricing.",
    href: "/why-jvto/the-jvto-difference",
  },
  {
    group: "Core",
    title: "Our Team",
    description: "Local team profiles, specialties, languages, review mentions.",
    href: "/why-jvto/our-team",
  },
  {
    group: "Core",
    title: "Reviews",
    description: "External platforms and guest voices (centralized).",
    href: "/why-jvto/reviews",
  },
  {
    group: "Core",
    title: "Community Standards",
    description: "Practical travel standards and destination stewardship.",
    href: "/why-jvto/community-standards",
  },
  {
    group: "Core",
    title: "Press & Recognition",
    description: "Guidebooks, media context, awards, and proof trail.",
    href: "/why-jvto/press-recognition",
  },
  {
    group: "Core",
    title: "Strategic Partners",
    description: "External verification layer: ISIC, HPWKI, INDECON.",
    href: "/why-jvto/strategic-partners",
  },

  // Proof & Transparency
  {
    group: "Proof & Transparency",
    title: "Proof Library (Hub)",
    description: "Start here to verify legality, safety, history, and press artifacts.",
    href: "/why-jvto/proof-transparency/",
  },
  {
    group: "Proof & Transparency",
    title: "Legal Proof",
    description: "Legal entity, licenses, and accountability references.",
    href: "/why-jvto/proof-transparency/legal/",
  },
  {
    group: "Proof & Transparency",
    title: "Police & Safety Proof",
    description: "Police-led authority trail and safety documentation references.",
    href: "/why-jvto/proof-transparency/police-safety/",
  },
  {
    group: "Proof & Transparency",
    title: "Press & Recognition Proof",
    description: "Proof assets for press items, media, and citations.",
    href: "/why-jvto/proof-transparency/press-recognition/",
  },
  {
    group: "Proof & Transparency",
    title: "History Artifacts Proof",
    description: "Heritage recognition and historical proof trail.",
    href: "/why-jvto/proof-transparency/history-artifacts/",
  },

  // Related (still part of the ecosystem)
  {
    group: "Related",
    title: "ISIC Student Deals",
    description: "Eligibility, verification flow, and eligible tours (student fairness layer).",
    href: "/student-deals/isic",
  },
  {
    group: "Related",
    title: "Ijen Digital Health Screening",
    description: "Digital safety innovation (QR verification) and public portal context.",
    href: "/travel-guide/ijen-health-screening",
  },
];
