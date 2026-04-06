type ContentPayload = Record<string, any>;

type ContentPageRow = {
  route: string;
  lang: string;
  seo: unknown;
  content: unknown;
  created_at?: unknown;
  updated_at?: unknown;
} | null;

type PinnedOverride = {
  title: string;
  description: string;
  h1: string;
};

const PINNED_CONTENT_OVERRIDES: Record<string, PinnedOverride> = {
  "/contact": {
    title: "Contact Java Volcano Tour Operator – WhatsApp & Email",
    description:
      "Contact JVTO: WhatsApp +6282244788833, email hello@javavolcano-touroperator.com. Office: Jl. Khairil Anwar No.102 A, Bondowoso, East Java, Indonesia.",
    h1: "Contact Java Volcano Tour Operator",
  },
  "/destinations": {
    title: "East Java Destinations – Bromo, Ijen, Tumpak Sewu & More | JVTO",
    description:
      "JVTO tour destinations in East Java: Mount Bromo, Kawah Ijen, Madakaripura Waterfall, Tumpak Sewu, and Papuma Beach. Practical guides for each location.",
    h1: "East Java Destinations: Volcanoes, Waterfalls & Coastline",
  },
  "/policy": {
    title: "JVTO Policies – Booking, Privacy & Inclusions Overview",
    description:
      "JVTO customer policies: booking/payment/cancellation rules, what is included and excluded in tours, and privacy/data protection. All policies in one place.",
    h1: "JVTO Policy Pack",
  },
  "/policy/booking-payment-cancellation": {
    title: "Booking, Payment & Cancellation Policy | JVTO Tours",
    description:
      "JVTO booking, payment, and cancellation policy. Deposit rules, balance payment timing, and Lifetime Travel Credit terms. All-inclusive private tours.",
    h1: "JVTO Booking, Payment & Cancellation Policy",
  },
  "/policy/inclusions-exclusions": {
    title: "What's Included & Excluded in JVTO Tours | JVTO",
    description:
      "Exact inclusions and exclusions in JVTO private tour packages. Only written items are binding — transport, permits, guide, hotel. Clear exclusions list.",
    h1: "JVTO Inclusions & Exclusions Policy",
  },
  "/policy/privacy": {
    title: "Privacy Policy | Java Volcano Tour Operator (JVTO)",
    description:
      "JVTO privacy policy: data collected, purpose of use, when data is shared for tour operations, and how to request data deletion. GDPR-aligned practices.",
    h1: "JVTO Privacy & Data Protection Policy",
  },
  "/travel-guide/booking-information": {
    title: "Booking Information – Payments, Changes & Travel Credit | JVTO",
    description:
      "How JVTO private tours are booked and paid. Deposit rules, balance payments, change requests, and the Lifetime Travel Credit guarantee explained.",
    h1: "Booking Information – How JVTO Private Tours Work",
  },
  "/travel-guide/ijen-health-screening": {
    title: "Ijen Health Screening – Real Checks, Digital Proof & QR | JVTO",
    description:
      "How Ijen health screening works with JVTO: real checks by trained staff, digital records with QR codes, and a public verification link for every guest.",
    h1: "Ijen Health Screening – Real Checks, Digital Proof",
  },
  "/travel-guide/packing-and-fitness": {
    title: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu | JVTO",
    description:
      "What to pack and how fit you need to be for Bromo, Ijen, and Tumpak Sewu tours. Specific gear list, fitness expectations, and what JVTO provides.",
    h1: "Packing & Fitness for Bromo, Ijen & Tumpak Sewu",
  },
  "/travel-guide/police-escort-for-groups": {
    title: "Traffic Police Escort for Tourist Groups in East Java | JVTO",
    description:
      "How official traffic police escorts work for larger tourist groups in East Java. When it is appropriate, how JVTO coordinates it, and what it involves.",
    h1: "Traffic Police Escort for Tourist Groups in East Java",
  },
  "/travel-guide/safety-on-tours": {
    title: "Safety on JVTO Tours – How We Plan & What You Should Know",
    description:
      "JVTO safety approach: Tourist Police-led planning, gear requirements, Ijen gas mask sterilisation, emergency protocols, and what guests must follow.",
    h1: "Safety on JVTO Tours",
  },
  "/travel-guide/weather-and-closures": {
    title: "Weather, Volcano Alerts & Closures – How JVTO Handles Changes",
    description:
      "How weather, volcanic alerts, and park closures affect Bromo and Ijen tours. JVTO's response protocol, rescheduling policy, and what guests can expect.",
    h1: "Weather, Volcano Alerts & Closures",
  },
  "/why-jvto/our-story": {
    title: "Our Story – JVTO History & Roots Since 2015 | JVTO",
    description:
      "Documented JVTO history: Booking.com award 2015, Stefan Loose guidebook 2016, and physical artifacts tracing the operator's roots in Bondowoso, East Java.",
    h1: "Our Story: Roots & Continuity Since 2015",
  },
  "/why-jvto/our-team": {
    title: "Our Team – Local East Java Guides & Drivers | JVTO",
    description:
      "Meet JVTO's 14-person local East Java team: experienced guides and drivers who handle daily volcano tour logistics for Bromo, Ijen, and Tumpak Sewu.",
    h1: "Local Team, Daily Execution",
  },
  "/why-jvto/reviews": {
    title: "Guest Reviews – Independent Voices on JVTO Tours | JVTO",
    description:
      "Independent reviews of JVTO on Tripadvisor, Trustpilot, Google, ISIC and Indecon. Verified voices — we cannot edit or remove any review on those platforms.",
    h1: "Guest Voices: Real Experiences, Independently Verified",
  },
  "/why-jvto/the-jvto-difference": {
    title: "The JVTO Difference: Safety Leadership & Verified Proof",
    description:
      "What sets JVTO apart: Tourist Police-led safety mindset, documented operational discipline, and a full proof library anyone can verify independently.",
    h1: "The JVTO Difference: Safety Leadership and Verified Proof",
  },
  "/verify-jvto/legal": {
    title: "Legal & Accountability Proof – PT Java Volcano Rendezvous | JVTO",
    description:
      "Verify JVTO's legal standing: PT registration (AHU), NIB business identity, TDUP tourism licence, and accountability chain. All independently verifiable.",
    h1: "Legal & Accountability Proof",
  },
  "/verify-jvto/police-safety": {
    title: "Police & Safety Proof – Tourist Police Integration | JVTO",
    description:
      "Verify JVTO's safety credentials: SPRIN tourist police letters, Ijen health screening evidence, and BBKSDA regulation compliance. Downloadable documents.",
    h1: "Police & Safety Proof",
  },
  "/verify-jvto/press-recognition": {
    title: "Press & Recognition – Third-Party Coverage of JVTO | JVTO",
    description:
      "Third-party press coverage: Detik.com, Radar Jember (Jawa Pos), and BBKSDA Jatim. Each article mentions JVTO founder by name. Independent context.",
    h1: "Press & Recognition: Third-Party Context",
  },
  "/verify-jvto/history-artifacts": {
    title: "History Artifacts – Documented JVTO Origins Since 2015 | JVTO",
    description:
      "Physical and documentary proof of JVTO's origins: Booking.com Guest Review Award 2015, Stefan Loose guidebook 2016, and continuous operation records.",
    h1: "History Artifacts: Documented Origins Since 2015",
  },
};

export function getPinnedContentOverride(route: string): PinnedOverride | null {
  return PINNED_CONTENT_OVERRIDES[route] ?? null;
}

export function applyPinnedContentOverrideToRow<T extends ContentPageRow>(
  route: string,
  row: T,
): T {
  const override = getPinnedContentOverride(route);

  if (!override || !row) return row;

  const seo = ((row.seo as ContentPayload | null) ?? {}) as ContentPayload;
  const content = ((row.content as ContentPayload | null) ?? {}) as ContentPayload;

  return {
    ...row,
    seo: {
      ...seo,
      title: override.title,
      description: override.description,
    },
    content: {
      ...content,
      h1: override.h1,
    },
  } as T;
}

export function resolvePinnedContentFields(
  route: string,
  row: ContentPageRow,
  fallback: {
    title: string;
    h1?: string;
    description?: string;
  },
) {
  const normalizedRow = applyPinnedContentOverrideToRow(route, row);
  const override = getPinnedContentOverride(route);
  const seo = ((normalizedRow?.seo as ContentPayload | null) ?? {}) as ContentPayload;
  const content = ((normalizedRow?.content as ContentPayload | null) ?? {}) as ContentPayload;

  return {
    row: normalizedRow,
    title: override?.title ?? seo.title ?? fallback.title,
    h1: override?.h1 ?? content.h1 ?? fallback.h1 ?? seo.title ?? fallback.title,
    description: override?.description ?? seo.description ?? fallback.description ?? "",
  };
}
