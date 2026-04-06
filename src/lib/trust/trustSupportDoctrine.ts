export const whyJvtoHubDoctrine = {
  fallbackSeo: {
    title: "Why Travel with Java Volcano Tour Operator (JVTO)",
    h1: "Why Travel with Java Volcano Tour Operator (JVTO)",
    description:
      "Discover why travelers choose JVTO for private East Java volcano journeys: police-led safety culture, legal legitimacy, real Ijen health screening, and proof you can verify before booking.",
  },
  eyebrow: "Trust & Authority",
  actions: [
    {
      label: "Explore Private Tours",
      href: "/tours",
      variant: "primary" as const,
    },
    {
      label: "Open Proof Library",
      href: "/verify-jvto",
      variant: "secondary" as const,
    },
  ],
  trustCards: [
    {
      title: "The JVTO Difference",
      copy:
        "See how route seriousness, private-only operations, and documented safety handling shape the whole company.",
      href: "/why-jvto/the-jvto-difference",
      icon: "shield",
    },
    {
      title: "Our Story",
      copy:
        "Trace the company story, historical continuity, and why the operation is more documented than most local tour businesses.",
      href: "/why-jvto/our-story",
      icon: "book",
    },
    {
      title: "Our Team",
      copy:
        "Meet the named local crew behind route execution, field handling, and guest support.",
      href: "/why-jvto/our-team",
      icon: "users",
    },
    {
      title: "Reviews",
      copy:
        "Read what independent platforms say about safety, handling, logistics, and real guest experience.",
      href: "/why-jvto/reviews",
      icon: "star",
    },
    {
      title: "Verify JVTO",
      copy:
        "Move from claims to proof through legal, safety, press, and history routes that can actually be checked.",
      href: "/verify-jvto",
      icon: "search",
    },
    {
      title: "Prepare & Book",
      copy:
        "Use the support layer for route fit, health readiness, weather rules, and payment clarity before booking.",
      href: "/travel-guide",
      icon: "fingerprint",
    },
  ],
  principles: [
    "Private tours only, so route handling stays coherent from pickup to finish.",
    "Ijen is treated as a real health and access decision, not just a photo opportunity.",
    "Proof is published in owner routes so guests can verify before payment.",
    "After this page, the next decision should be route selection or proof inspection, not more guesswork.",
  ],
  readNext: [
    { href: "/tours", label: "Explore private tours" },
    { href: "/verify-jvto", label: "Open proof library" },
    { href: "/travel-guide", label: "Open Prepare & Book" },
  ],
  fallbackFaq: [
    {
      q: "Do you mix strangers in one car?",
      a: "No. JVTO runs private tours only.",
    },
    {
      q: "Where can I check legal and safety proof?",
      a: "Open Verify JVTO to inspect the company’s proof categories and supporting documents.",
    },
    {
      q: "Where should I read route readiness rules before payment?",
      a: "Use Prepare & Book for Ijen screening, weather, packing, and booking information.",
    },
  ],
} as const;

export const verifyJvtoHubDoctrine = {
  fallbackSeo: {
    title: "Verify JVTO – Credentials, Safety, Press & History",
    h1: "Verify JVTO: A Proof Library You Can Check",
    description:
      "Review JVTO's credentials, safety context, press references, and history artifacts before booking or payment.",
  },
  eyebrow: "Proof Library",
  actions: [
    {
      label: "Open Legal Proof",
      href: "/verify-jvto/legal",
      variant: "primary" as const,
    },
    {
      label: "Explore Private Tours",
      href: "/tours",
      variant: "secondary" as const,
    },
  ],
  steps: [
    "Start with legal identity if you want the fastest proof path.",
    "Then move into police and safety context if route seriousness is your main concern.",
    "Use press and history as supporting layers, not replacements for core legality.",
    "After verification, move back into tours or Prepare & Book with better context.",
  ],
  categoryCards: [
    {
      title: "Legal",
      copy:
        "Company legality, entity traceability, and the route you should open first if you want to confirm JVTO exists as a real business.",
      href: "/verify-jvto/legal",
      icon: "file",
    },
    {
      title: "Police & Safety",
      copy:
        "The proof path for police context, safety handling, and why JVTO treats route seriousness differently from generic operators.",
      href: "/verify-jvto/police-safety",
      icon: "shield",
    },
    {
      title: "Press Recognition",
      copy:
        "Third-party references, media context, and the recognition layer that supports the company story from outside the site itself.",
      href: "/verify-jvto/press-recognition",
      icon: "news",
    },
    {
      title: "History Artifacts",
      copy:
        "The continuity layer: artifacts that help show the operation did not appear yesterday and can be traced over time.",
      href: "/verify-jvto/history-artifacts",
      icon: "book",
    },
  ],
  readNext: [
    { href: "/tours", label: "Return to private routes" },
    { href: "/travel-guide", label: "Open Prepare & Book" },
    { href: "/why-jvto", label: "Read why JVTO is different" },
  ],
} as const;

export const travelGuideHubDoctrine = {
  fallbackSeo: {
    title: "Prepare & Book – Health, Booking & Route Guidance",
    h1: "Prepare & Book – Health, Booking & Route Guidance",
    description:
      "Read the official JVTO travel guide before booking: health screening, safety, weather, packing, payments, cancellations, and other practical planning information.",
  },
  eyebrow: "Prepare & Book",
  actions: [
    {
      label: "Read Booking Information",
      href: "/travel-guide/booking-information",
      variant: "primary" as const,
    },
    {
      label: "Back to Tours",
      href: "/tours",
      variant: "secondary" as const,
    },
  ],
  supportPrinciples: [
    "The package page should carry the main commercial decision.",
    "This cluster exists to remove route uncertainty before payment.",
    "Ijen-related guidance should be read as operational readiness, not generic travel inspiration.",
    "Weather and closure logic follows official signals plus field reality, including MAGMA / PVMBG and local access rules.",
  ],
  guideCards: [
    {
      title: "Booking Information",
      copy:
        "Read the booking flow, payment logic, and what to expect before you confirm a private route.",
      href: "/travel-guide/booking-information",
      icon: "card",
    },
    {
      title: "Ijen Health Screening",
      copy:
        "Understand the medical seriousness of Ijen and how screening is used before ascent.",
      href: "/travel-guide/ijen-health-screening",
      icon: "stethoscope",
    },
    {
      title: "Safety on Tours",
      copy:
        "See how route decisions, driver handling, and field judgment work once conditions change on the ground.",
      href: "/travel-guide/safety-on-tours",
      icon: "shield",
    },
    {
      title: "Packing & Fitness",
      copy:
        "Use this page to check route fit, footwear, layers, and realistic physical readiness.",
      href: "/travel-guide/packing-and-fitness",
      icon: "backpack",
    },
    {
      title: "Weather & Closures",
      copy:
        "Read how JVTO checks MAGMA / PVMBG and local access conditions when weather or volcanic status affects a route.",
      href: "/travel-guide/weather-and-closures",
      icon: "weather",
    },
    {
      title: "Police Escort for Groups",
      copy:
        "A narrow but important route for larger movements that need formal coordination rather than informal promises.",
      href: "/travel-guide/police-escort-for-groups",
      icon: "activity",
    },
  ],
} as const;

export function extractHubIntro(
  content: Record<string, unknown> | null,
  fallback: string,
) {
  if (!content) return fallback;

  if (typeof content.lede === "string" && content.lede.trim()) {
    return content.lede;
  }

  if (Array.isArray(content.lede) && content.lede.length > 0) {
    return content.lede
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .join(" ");
  }

  if (typeof content.hero_subhead === "string" && content.hero_subhead.trim()) {
    return content.hero_subhead;
  }

  return fallback;
}
