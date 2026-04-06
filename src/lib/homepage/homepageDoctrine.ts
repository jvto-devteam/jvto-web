import { SITE_CONFIG } from "@/lib/site-config";

export const homepageHeroDoctrine = {
  eyebrow: "Tourist Police-Led Private Tours",
  highlights: [
    "Private tours only",
    "Licensed Indonesian operator",
    "No shared groups",
    "Ijen screening before night trek",
  ],
  trustStrip: [
    "MAGMA-aware route context",
    "Prepare & Book support built in",
    "Proof before payment",
  ],
  reviewLink: SITE_CONFIG.proofLinks.trustpilot,
  reviewLabel: "Trustpilot reviews",
} as const;

export const homepageAuthorityRealityDoctrine = {
  eyebrow: "Trust Signals You Can See Immediately",
  title: "Operator reality, route seriousness, and proof belong close together.",
  copy:
    "The homepage should answer the biggest pre-booking questions fast: who runs the route, how Ijen access is handled, whether volcano conditions are treated seriously, and whether the operator identity is actually checkable.",
  actions: [
    { label: "Verify JVTO", href: "/verify-jvto", variant: "primary" as const },
    {
      label: "Open Prepare & Book",
      href: "/travel-guide",
      variant: "secondary" as const,
    },
  ],
  items: [
    {
      title: "Tourist Police-Led Operating Model",
      copy:
        "Founder context is visible early, not hidden behind private chat promises or anonymous handling.",
      href: "/verify-jvto/police-safety",
      meta: "Authority",
      icon: "shield",
    },
    {
      title: "Live Bromo And Ijen Status",
      copy:
        "Volcano decisions should follow current route context, not static assumptions about access or timing.",
      href: "/travel-guide/weather-and-closures",
      meta: "Live Context",
      icon: "waves",
    },
    {
      title: "Doctor-Backed Ijen Screening",
      copy:
        "Ijen routes include real medical clearance logic before the night climb, with visible workflow and proof.",
      href: "/travel-guide/ijen-health-screening",
      meta: "Access Control",
      icon: "activity",
    },
    {
      title: "Legal And Company Proof",
      copy:
        "PT identity, operator traceability, and licensing context stay visible before a deposit is ever discussed.",
      href: "/verify-jvto/legal",
      meta: "Traceability",
      icon: "building",
    },
  ],
} as const;

export const homepageTrustGatewayDoctrine = {
  eyebrow: "Founder Context, Reviews, And Proof",
  title:
    "Trust works better when the people layer and the proof layer stay connected.",
  founder: {
    imageSrc: "/founder/agung_sambuko.jpg",
    imageAlt: `Agung "${SITE_CONFIG.founder.alias}" Sambuko, founder of JVTO`,
    kicker: "Police-Led Context",
    name: `${SITE_CONFIG.founder.name} (${SITE_CONFIG.founder.alias})`,
    role: "Founder & Active Tourist Police",
    paragraphs: [
      "JVTO did not start as a brochure brand. It grew from real East Java hospitality roots into a licensed private operator shaped by Tourist Police experience, route seriousness, and field accountability.",
      "That matters because guests are not only buying scenery. They are trusting someone to handle night departures, active-volcano conditions, screening rules, and long driving days correctly.",
    ],
  },
  cards: [
    {
      kicker: "Independent Reviews",
      title:
        "Outside review streams are useful when they stay close to the proof path.",
      copy:
        "Read recurring comments about guides, drivers, logistics, and route handling before deciding whether the operator feels credible enough for your trip.",
      primary: {
        label: "View Trustpilot",
        href: SITE_CONFIG.proofLinks.trustpilot,
        external: true,
      },
      secondary: {
        label: "Review Sources",
        href: "/why-jvto/reviews",
      },
    },
    {
      kicker: "Proof Library",
      title:
        "Legal identity, police context, history, and press references should be inspectable.",
      copy:
        "JVTO keeps the verification layer separate so guests can check operator identity and continuity without relying on homepage claims alone.",
      primary: {
        label: "Open Proof Library",
        href: "/verify-jvto",
      },
      secondary: {
        label: "Legal & Company Proof",
        href: "/verify-jvto/legal",
      },
    },
  ],
  actions: [
    {
      label: "Read Our Story",
      href: "/why-jvto/our-story",
      variant: "primary" as const,
    },
    {
      label: "Open Proof Library",
      href: "/verify-jvto",
      variant: "secondary" as const,
    },
  ],
} as const;

export const homepageSupportGatewayDoctrine = {
  eyebrow: "Prepare & Book",
  title: "Review the route support before you pay.",
  copy:
    "JVTO should not force guests to click around blindly after they are already emotionally sold. Booking information, Ijen readiness, safety context, and practical guidance belong close to the decision.",
  actions: [
    {
      label: "Open Prepare & Book",
      href: "/travel-guide",
      variant: "primary" as const,
    },
    { label: "Policies & Rules", href: "/policy", variant: "secondary" as const },
  ],
  cards: [
    {
      href: "/travel-guide/booking-information",
      title: "Booking Information",
      copy:
        "Deposits, timing, and how the booking process actually works before payment.",
      icon: "wallet",
    },
    {
      href: "/travel-guide/ijen-health-screening",
      title: "Ijen Screening",
      copy:
        "Medical clearance and QR logic explained before you commit to an Ijen route.",
      icon: "activity",
    },
    {
      href: "/travel-guide",
      title: "Prepare & Book Hub",
      copy:
        "Use the support hub when you need packing, route readiness, and practical answers in one place.",
      icon: "book",
    },
    {
      href: "/contact",
      title: "Need A Human Answer?",
      copy:
        "If the route fits but you still have a question, contact JVTO directly before paying a deposit.",
      icon: "help",
    },
  ],
} as const;

export const homepageFinalCtaDoctrine = {
  eyebrow: "JVTO · East Java Private Tours",
  lines: ["Browse routes.", "Check the proof.", "Book with confidence."],
  copy:
    "The right flow is simple: explore the route, verify the operator, then move into booking with support pages already connected to the decision.",
  actions: [
    { label: "View All Tours", href: "/tours", variant: "primary" as const },
    {
      label: "Prepare & Book",
      href: "/travel-guide",
      variant: "secondary" as const,
    },
  ],
} as const;
