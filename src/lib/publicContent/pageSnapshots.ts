import type { PublicPageSnapshot } from "./types";
import dbPageSnapshotsJson from "./generated/dbPageSnapshots.json";

const SNAPSHOT_GENERATED_AT = "2026-05-08T00:00:00.000Z";

function createPageSnapshot(
  route: string,
  seo: PublicPageSnapshot["seo"],
  content: PublicPageSnapshot["content"],
): PublicPageSnapshot {
  return {
    route,
    lang: "en",
    seo,
    content,
    meta: {
      generatedAt: SNAPSHOT_GENERATED_AT,
      version: "1",
      source: "phase-2-local-snapshot",
    },
  };
}

const manualPageSnapshots: Record<string, PublicPageSnapshot> = {
  "/": createPageSnapshot(
    "/",
    {
      title:
        "Bromo Ijen Tour from Surabaya & Bali — Private | JVTO",
      description:
        "Private volcano tours from Surabaya & Bali. Tourist Police-led. No shared groups. 4.8★ Trustpilot. NIB 1102230032918. From IDR 1.55M/pax.",
    },
    {
      h1: "Tourist Police-Led Private Volcano Tours in East Java",
    },
  ),
  "/blog": createPageSnapshot(
    "/blog",
    {
      title: "Insights | JVTO's Blog on Safety, Planning & Community",
      description:
        "Explore our articles on choosing a legal operator, understanding Ijen health screening, and maximizing your East Java trip. Expert advice from a police-led team.",
    },
    {
      h1: "Insights & Explainers",
    },
  ),
  "/contact": createPageSnapshot(
    "/contact",
    {
      title: "Contact JVTO Tours | Plan Your East Java Adventure",
      description:
        "Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We're here to help you 24/7.",
    },
    {
      h1: "Contact Us",
    },
  ),
  "/destinations": createPageSnapshot(
    "/destinations",
    {
      title: "East Java Destinations | Bromo, Ijen & More",
      description:
        "Explore 5 East Java destinations with JVTO: Bromo 2,329 m, Ijen 2,386 m, Tumpak Sewu, Madakaripura, Papuma. Private tours, 4.8★ Trustpilot.",
    },
    {
      h1: "Destinations",
    },
  ),
  "/isic/student-package": createPageSnapshot(
    "/isic/student-package",
    {
      title: "Explore Java's Volcanoes with ISIC Benefits | JVTO",
      description:
        "Exclusive student deals for ISIC cardholders on safe, all-inclusive volcano tours in East Java with Java Volcano Tour Operator.",
    },
    {
      h1: "Explore Java's Volcanoes with ISIC Benefits",
    },
  ),
  "/student-deals/isic": createPageSnapshot(
    "/student-deals/isic",
    {
      title: "ISIC Student Deals — JVTO",
      description:
        "Student verification and fair pricing context: Alive Verify API handshake concept, and the practical reason JVTO uses it.",
    },
    {
      h1: "ISIC Student Deals",
    },
  ),
  "/tours": createPageSnapshot(
    "/tours",
    {
      title: "16 Private Bromo, Ijen & Tumpak Sewu Tours | JVTO",
      description:
        "Browse 16 private volcano tour packages from Surabaya or Bali. Bromo sunrise, Ijen blue fire, Tumpak Sewu. Tourist Police-led. All-inclusive. 4.8★ Trustpilot.",
    },
    {
      h1: "Private Bromo, Ijen & Tumpak Sewu Tours",
    },
  ),
  "/tours/from-bali": createPageSnapshot(
    "/tours/from-bali",
    {
      title: "Bromo Ijen Tour from Bali — 4 Private Packages | JVTO",
      description:
        "Private 3D–5D Bromo & Ijen tours from Bali, ferry crossing included. Tourist Police-led, all-inclusive. 4.8★ Trustpilot. From IDR 2.85M/pax.",
    },
    {
      h1: "Bali Tours",
    },
  ),
  "/tours/from-surabaya": createPageSnapshot(
    "/tours/from-surabaya",
    {
      title: "Bromo Ijen Tour from Surabaya — 12 Private Packages | JVTO",
      description:
        "Private 2D–6D Bromo, Ijen & Tumpak Sewu tours from Surabaya. Tourist Police-led, all-inclusive. 4.8★ Trustpilot. From IDR 1.55M/pax.",
    },
    {
      h1: "Surabaya Tours",
    },
  ),
  "/travel-guide": createPageSnapshot(
    "/travel-guide",
    {
      title:
        "Travel Guide — Booking, Safety & Practical Info | Java Volcano Tour Operator",
      description:
        "This Travel Guide is your practical handbook for traveling with Java Volcano Tour Operator (JVTO). Here you'll find clear information on bookings, payments, reschedules, health screening for Ijen, safety on tours, packing, weather-related closures, and when police escort can be arranged for groups.",
    },
    {
      h1: "Travel Guide — Booking, Safety & Practical Info",
    },
  ),
  "/travel-guide/faq": createPageSnapshot(
    "/travel-guide/faq",
    {
      title: "Frequently Asked Questions (FAQ) - Java Volcano Tour Operator",
      description:
        "Find answers to common questions about Bromo, Ijen, and Tumpak Sewu tour packages.",
    },
    {
      h1: "Frequently Asked Questions",
    },
  ),
  "/travel-guide/booking-information": createPageSnapshot(
    "/travel-guide/booking-information",
    {
      title: "Booking Information | Payments, Changes & Inclusions | JVTO",
      description:
        "How JVTO tours work: booking steps, payments, cancellations, logistics, inclusions, safety, and support. Ijen health certificate is included.",
    },
    {
      h1: "Booking, Payment & Cancellation",
    },
  ),
  "/travel-guide/ijen-health-screening": createPageSnapshot(
    "/travel-guide/ijen-health-screening",
    {
      title: "Ijen Health Screening | Real Checks, Digital Proof | JVTO",
      description:
        "Learn how JVTO handles real pre-hike screening for Ijen, including health checks, digital verification, and guest safety procedures.",
    },
    {
      h1: "Ijen Health Screening — Real Checks, Digital Proof",
    },
  ),
  "/travel-guide/packing-and-fitness": createPageSnapshot(
    "/travel-guide/packing-and-fitness",
    {
      title: "Packing & Fitness Guide | JVTO",
      description:
        "What to bring, what JVTO provides, and how fit you should be for Bromo, Ijen, Tumpak Sewu, and related East Java adventures.",
    },
    {
      h1: "Packing & Fitness Guide",
    },
  ),
  "/travel-guide/police-escort-for-groups": createPageSnapshot(
    "/travel-guide/police-escort-for-groups",
    {
      title: "Police Escort for Tourist Groups in East Java | JVTO",
      description:
        "Understand how official police escort requests work for large tourist groups traveling with JVTO in East Java.",
    },
    {
      h1: "Police Escort for Tourist Groups in East Java",
    },
  ),
  "/travel-guide/safety-on-tours": createPageSnapshot(
    "/travel-guide/safety-on-tours",
    {
      title: "Safety on Our Tours | JVTO",
      description:
        "Vehicle standards, guide protocols, Ijen-specific safety rules, and the guest responsibilities that shape every JVTO tour.",
    },
    {
      h1: "Safety on Our Tours",
    },
  ),
  "/travel-guide/weather-and-closures": createPageSnapshot(
    "/travel-guide/weather-and-closures",
    {
      title: "Weather, Volcanic Alerts & Closures | JVTO",
      description:
        "How JVTO handles itinerary changes when weather, volcanic alerts, or official closures affect East Java travel conditions.",
    },
    {
      h1: "Weather, Volcanic Alerts & Closures",
    },
  ),
  "/policy": createPageSnapshot(
    "/policy",
    {
      title: "JVTO Policies | Booking, Privacy & Inclusions",
      description:
        "Navigation hub for JVTO policy documents covering privacy, booking, payment, cancellation, and inclusions/exclusions.",
    },
    {
      h1: "JVTO Policies",
    },
  ),
  "/policy/booking-payment-cancellation": createPageSnapshot(
    "/policy/booking-payment-cancellation",
    {
      title: "Booking, Payment & Cancellation Policy | JVTO",
      description:
        "Rules for confirming a booking, payment timing, reschedules, travel credit, and cancellation handling for JVTO private tours.",
    },
    {
      h1: "Booking, Payment & Cancellation",
    },
  ),
  "/policy/inclusions-exclusions": createPageSnapshot(
    "/policy/inclusions-exclusions",
    {
      title: "Inclusions & Exclusions Policy | JVTO",
      description:
        "Clarifies what is included, conditionally included, or excluded in JVTO private tour packages.",
    },
    {
      h1: "Inclusions & Exclusions",
    },
  ),
  "/policy/privacy": createPageSnapshot(
    "/policy/privacy",
    {
      title: "Privacy Policy | JVTO Tours",
      description:
        "How JVTO collects, uses, stores, and protects personal data for bookings, guest safety, and tour operations.",
    },
    {
      h1: "Privacy Policy",
    },
  ),
  "/why-jvto/community-standards": createPageSnapshot(
    "/why-jvto/community-standards",
    {
      title: "Community & Sustainability Standards | JVTO",
      description:
        "Our commitment to local hiring, sustainability, fair operations, and responsible tourism across East Java.",
    },
    {
      h1: "Community & Sustainability Standards",
    },
  ),
  "/why-jvto/our-story": createPageSnapshot(
    "/why-jvto/our-story",
    {
      title: "Our Story | JVTO",
      description:
        "How JVTO grew from local hosting roots into a licensed, police-led East Java tour operator with documented safety systems.",
    },
    {
      h1: "Our Story — From Homestay Host to Police-Led Tour Operator",
    },
  ),
  "/why-jvto/our-team": createPageSnapshot(
    "/why-jvto/our-team",
    {
      title: "Meet Our Team | JVTO",
      description:
        "Meet the local JVTO guides and team members who operate private volcano tours across East Java.",
    },
    {
      h1: "Meet Our Team",
    },
  ),
  "/why-jvto/reviews": createPageSnapshot(
    "/why-jvto/reviews",
    {
      title: "Guest Reviews & Social Proof | JVTO",
      description:
        "Read the recurring themes across independent guest reviews and social proof signals for Java Volcano Tour Operator.",
    },
    {
      h1: "Reviews",
    },
  ),
  "/why-jvto/the-jvto-difference": createPageSnapshot(
    "/why-jvto/the-jvto-difference",
    {
      title: "The JVTO Difference — Verified, Private, Responsible",
      description:
        "A clear breakdown of the standards, proof signals, and operating principles that make JVTO different.",
    },
    {
      h1: "The JVTO Difference — Verified, Private, Responsible",
    },
  ),
  "/verify-jvto": createPageSnapshot(
    "/verify-jvto",
    {
      title: "Verify: Forensic Evidence Locker & Legal Documents",
      description:
        "Forensic verification of JVTO's Tourist Police authority, NIB legality, and operational safety protocols. Download official SHA256-signed documents.",
    },
    {
      h1: "Trust Through Transparency.",
    },
  ),
  "/verify-jvto/history-artifacts": createPageSnapshot(
    "/verify-jvto/history-artifacts",
    {
      title: "JVTO History Artifacts — Documented Origins Since 2015",
      description:
        "JVTO timeline: Booking.com award (2015), Stefan Loose guide (2016), Detik.com press (2021), PT registration (2023). All independently verifiable.",
    },
    {
      h1: "History Artifacts: Documented Origins Since 2015",
    },
  ),
  "/verify-jvto/legal": createPageSnapshot(
    "/verify-jvto/legal",
    {
      title: "JVTO Legal Documents — NIB, TDUP & PT Registration | JVTO",
      description:
        "Verify NIB 1102230032918, TDUP license & PT Java Volcano Rendezvous registration. SHA256-verified PDFs. Police-led East Java operator since 2015.",
    },
    {
      h1: "Legal Documents",
    },
  ),
  "/verify-jvto/police-safety": createPageSnapshot(
    "/verify-jvto/police-safety",
    {
      title: "Verify: Police Authority & Safety Protocols | JVTO",
      description:
        "Verify JVTO Tourist Police (POLPAR) authority. SPRIN POLPAR docs, Satlantas escort coordination, BBKSDA SE.1658 compliance, and health screening records.",
    },
    {
      h1: "Police & Safety",
    },
  ),
  "/verify-jvto/press-recognition": createPageSnapshot(
    "/verify-jvto/press-recognition",
    {
      title: "JVTO Press Recognition — Detik.com & Stefan Loose | JVTO",
      description:
        "Detik.com, Stefan Loose travel guide & Radar Jember coverage of JVTO — third-party verification of police-led East Java tour operator credentials.",
    },
    {
      h1: "Press Recognition",
    },
  ),
  "/why-jvto": createPageSnapshot(
    "/why-jvto",
    {
      title: "Why Choose Java Volcano Tour Operator",
      description:
        "Why travellers choose JVTO for private Bromo, Ijen and Tumpak Sewu tours: tourist police-led safety culture, registered Indonesian travel company, real health screening, local guides and transparent policies.",
    },
    {
      h1: "Why Choose Java Volcano Tour Operator",
      faq: [
        {
          q: "Do you mix strangers into one car?",
          a: "No. JVTO runs private tours only.",
        },
        {
          q: "What if weather or closures change the plan?",
          a: "We adapt early and communicate clearly.",
        },
        {
          q: "Where can I verify legality and proof?",
          a: "Everything is organized in our Proof Library.",
        },
        {
          q: "Where are your booking/payment terms?",
          a: "Full terms are on the booking & payment policy page.",
        },
        {
          q: "How do you handle personal data?",
          a: "All data handling is documented in our privacy policy.",
        },
      ],
    },
  ),
};

const dbPageSnapshots = dbPageSnapshotsJson as Record<string, PublicPageSnapshot>;

export const publicPageSnapshots: Record<string, PublicPageSnapshot> = {
  ...manualPageSnapshots,
  ...dbPageSnapshots,
};

export function getPublicPageSnapshotRecord(route: string) {
  return publicPageSnapshots[route] ?? null;
}

export function getPublicPageSnapshotUpdatedAt(route: string) {
  const snapshot = getPublicPageSnapshotRecord(route);
  if (!snapshot) return null;

  return snapshot.meta.updatedAt ?? snapshot.meta.generatedAt;
}

export function listPublicPageRoutesByPrefix(prefix: string) {
  const withSlash = prefix.endsWith("/") ? prefix : `${prefix}/`;

  return Object.keys(publicPageSnapshots)
    .filter((route) => route.startsWith(withSlash))
    .sort();
}
