import type { PublicPageSnapshot } from "./types";
// Editorial content-plane swap (jvto_cms seed): the retired jvto_dev editorial
// export (generated/dbPageSnapshots.json) is no longer merged here — the seed
// supersedes it for every SEED_COVERED_ROUTES route. manualPageSnapshots stays
// as the fallback for routes the seed does NOT cover (e.g. /markets/*, /blog,
// /isic/*). The JSON file remains on disk but unreferenced for editorial pages.
import { seedPageSnapshots } from "@/lib/cms/seedResolver";

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
        "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
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
      h1: "All Destinations Tours",
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
};

// Seed WINS for its covered routes; manualPageSnapshots is the fallback for the
// rest. (Was previously merging generated/dbPageSnapshots.json — retired.)
export const publicPageSnapshots: Record<string, PublicPageSnapshot> = {
  ...manualPageSnapshots,
  ...seedPageSnapshots,
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
