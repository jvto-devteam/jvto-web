// Package Readiness Bundle helper — typed re-export of the synced JSON artifacts.
// Source: llm-wiki/output/products/package-readiness/, copied via `npm run sync:packages`.
//
// Do not hand-edit the JSON files under src/data/package-readiness/.
// Fix data in llm-wiki package sources, re-run the compiler there
// (scripts/compile_packages.py --write), then re-sync here.
//
// Note: this is the consumption-ready surface. It is not yet imported by any
// page — runtime wiring (DB-vs-artifact validation, page rendering) is deferred.

import registryJson from "@/data/package-readiness/package-registry.json";
import pricingJson from "@/data/package-readiness/package-pricing.json";
import itinerariesJson from "@/data/package-readiness/package-itineraries.json";
import bookingJson from "@/data/package-readiness/booking-compatibility.json";
import gapReportJson from "@/data/package-readiness/gap-report.json";
import manifestJson from "@/data/package-readiness/_manifest.json";

export type PackageOrigin = "surabaya" | "bali";

export type PackageRegistryEntry = {
  package_id: string;
  slug: string;
  origin: PackageOrigin;
  title: string;
  duration: string;
  public_url: string;
  ijen_relevant: boolean;
  visits_madakaripura: boolean;
  is_specialty: boolean;
};

export type PackagePaxTier = {
  min_pax: number;
  max_pax: number | null;
  idr_per_person: number;
};

export type PackagePricing = {
  package_id: string;
  slug: string;
  currency: string;
  ferry_included: boolean;
  pax_tiers: PackagePaxTier[];
};

export type PackageItineraryDay = {
  day: number;
  title: string;
  meals: string[];
  hotel: string | null;
};

export type PackageItinerary = {
  package_id: string;
  slug: string;
  days: PackageItineraryDay[];
};

export type PackageBookingCompatibility = {
  package_id: string;
  slug: string;
  instant_book: boolean;
  whatsapp_assisted: boolean;
  booking_paths: string[];
};

export type PackageGapFinding = {
  rule_id: string;
  severity: string;
  package_id: string | null;
  field: string | null;
  message: string;
};

export type PackageGapReport = {
  summary: { total: number; errors: number; warnings: number };
  findings: PackageGapFinding[];
};

export type PackageReadinessManifest = {
  schema_version: string;
  generated_by: string;
  generated_at: string;
  dry_run: boolean;
  canonical_package_count: number;
  source_hashes: Record<string, string>;
  findings_by_rule: Record<string, number>;
  artifacts: string[];
  clean: boolean;
};

export const packageRegistry: PackageRegistryEntry[] =
  registryJson as PackageRegistryEntry[];
export const packagePricing: PackagePricing[] = pricingJson as PackagePricing[];
export const packageItineraries: PackageItinerary[] =
  itinerariesJson as PackageItinerary[];
export const bookingCompatibility: PackageBookingCompatibility[] =
  bookingJson as PackageBookingCompatibility[];
export const packageGapReport: PackageGapReport =
  gapReportJson as PackageGapReport;
export const packageReadinessManifest: PackageReadinessManifest =
  manifestJson as PackageReadinessManifest;
