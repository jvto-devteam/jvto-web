
export const SITE_CONFIG = {
  brand: "Java Volcano Tour Operator",
  brandAbbreviation: "JVTO",
  legalName: "PT Java Volcano Rendezvous",
  metaDescription:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
  registrationNumber: "1102230032918",
  foundingDate: "2015-01-01",
  office: {
    street: "Jl. Khairil Anwar No.102 A, Badean",
    city: "Bondowoso",
    region: "East Java",
    postalCode: "68214",
    country: "Indonesia",
    googleMaps: "https://maps.app.goo.gl/y3hYeK2CVaK9x4e98",
    googleMapsCid: "1266403973589689021",
    mapUrl: "https://www.google.com/maps?cid=1266403973589689021",
  },
  contact: {
    email: "hello@javavolcano-touroperator.com",
    emailSecondary: "javavolcanotouroperator@gmail.com",
    whatsapp: "+62 822-4478-8833",
    phone: "+62 822-4478-8833",
  },
  founder: {
    name: "Agung Sambuko",
    alias: "Mr. Sam",
    role: "Active Tourist Police Officer & Founder",
    /** Local path for Next.js <Image>; prepend SITE_URL for schema absolute URLs */
    image: "/founder/agung_sambuko.jpg",
    portraitUrl: "/founder/mr-sam-tourist-police-portrait.png",
    policeUnit: "Indonesian National Police — Ditpamobvit",
    unitFullName:
      "Directorate of Vital Object Security (Direktorat Pengamanan Objek Vital)",
    description:
      "Founder of JVTO and active member of the East Java Tourist Police Unit (Ditpamobvit), specializing in tourist safety and risk management.",
    knowsAbout: [
      "Tourist Safety East Java",
      "Volcanic Route Risk Management",
      "Ijen Crater Operations",
      "Bromo Operations",
      "Indonesian Tourism Law",
      "Tourist Police Protocols",
    ],
  },
  proofLinks: {
    googleReviews: "https://g.page/r/Cb3i9Eu0K5MREB0/review",
    tripadvisor:
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
    trustpilot: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    healthScreening: "https://health.mountijen.com",
  },
  navigation: {
    mainNav: [
      { href: "/tours", label: "Private Tours" },
      { href: "/tours/from-surabaya", label: "From Surabaya" },
      { href: "/tours/from-bali", label: "From Bali" },
      { href: "/why-jvto", label: "Why JVTO" },
      { href: "/travel-guide", label: "Travel Guide" },
      { href: "/isic/student-package", label: "ISIC Students" },
    ],
    footerNav: [
      {
        title: "Explore",
        links: [
          { href: "/tours", label: "All Tours" },
          { href: "/tours/from-surabaya", label: "From Surabaya" },
          { href: "/tours/from-bali", label: "From Bali" },
          { href: "/destinations", label: "Destinations" },
        ],
      },
      {
        title: "Plan & Prepare",
        links: [
          { href: "/travel-guide", label: "Travel Guide Hub" },
          { href: "/travel-guide/faq", label: "FAQ" },
          { href: "/travel-guide/booking-information", label: "How to Book" },
          { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
        ],
      },
      {
        title: "About JVTO",
        links: [
          { href: "/why-jvto", label: "The JVTO Difference" },
          { href: "/why-jvto/our-story", label: "Police-Led Safety" },
          { href: "/verify-jvto", label: "Verify Documents" },
          { href: "/contact", label: "Contact Us" },
        ],
      },
    ],
  },

  // ── Reviews ─────────────────────────────────────────────────────────────
  // Canonical review aggregate + per-platform metrics live in `src/lib/jvtoReviews.ts`
  // (AGGREGATE_RATING + REVIEW_PLATFORMS). Wiki ingest updates that one file.
  // Profile links retained here for footer/legal references.
  reviewLinks: {
    trustpilot: "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    tripadvisor:
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
    googleMaps: "https://www.google.com/maps?cid=1266403973589689021",
    getYourGuide: "https://www.getyourguide.com/java-volcano-tour-operator-s260697/",
    isic: "https://www.isic.org/discounts/?providerId=259268",
    isicProviderId: "259268",
    indecon:
      "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator",
  },

  // ── Bank Accounts ───────────────────────────────────────────────────────
  bankAccounts: [
    {
      bank: "BRI",
      account: "001301001779564",
      swiftBic: "BRINIDJAXXX",
      name: "PT Java Volcano Rendezvous",
    },
    {
      bank: "BCA",
      account: "1200944352",
      swiftBic: "CENAIDJAXXX",
      name: "PT Java Volcano Rendezvous",
    },
  ],

  // ── Booking Policy (SSOT — matches JVTO_Policy_Pack_v5) ────────────────
  bookingPolicy: {
    depositRate: 0.2,
    depositRateLabel: "20%",
    fullPaymentThresholdDays: 14,
    cancellationCutoffHours: 48,
    cancellationOutcomeBefore:
      "100% non-expiring travel credit, transferable to any traveler",
    cancellationOutcomeAfter: "Deposit forfeited",
    paymentMethod: "Bank transfer only — BRI or BCA",
  },

  // ── WhatsApp (post-booking CS / general contact — NOT for package inquiries)
  whatsapp: {
    number: "+6282244788833",
    waLink: "https://wa.me/6282244788833",
  },

  // ── Static Assets ───────────────────────────────────────────────────────
  assets: {
    logoUrl: "https://javavolcano-touroperator.com/assets/img/jvto-color.png",
    heroImageUrl:
      "https://javavolcano-touroperator.com/assets/img/hero/home.webp",
  },

  // ── Exchange Rates (manual — update periodically) ───────────────────────
  exchangeRates: {
    USD: 16250,
    EUR: 17800,
    AUD: 10300,
    SGD: 12000,
  },
  exchangeRatesLastUpdated: "2026-04-22",

  // ── Crew Role Labels (SSOT: DB crew_members.type → display / schema jobTitle)
  crewRoles: {
    Guide: "Licensed Tour Guide",
    Driver: "Professional Tour Driver",
  },
} as const;

/**
 * Founding year derived from `SITE_CONFIG.foundingDate` (CANONICAL_FACTS lock: 2015,
 * guesthouse era / Booking.com award). Single dynamic source for every "EST" brand
 * tag in the chrome — NEVER hardcode "EST 2016" or "EST 2015" as static copy.
 */
export const FOUNDING_YEAR = Number(SITE_CONFIG.foundingDate.slice(0, 4));

/** Brand tag rendered next to the JVTO wordmark (nav/footer chrome). */
export const BRAND_EST_TAG = `EST ${FOUNDING_YEAR}`;
