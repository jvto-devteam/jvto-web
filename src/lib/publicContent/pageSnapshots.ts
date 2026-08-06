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
