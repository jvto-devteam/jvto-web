// Migrated 2026-08-18: no internal caller found for this route (checked fetch calls,
// imports, git history) — sourced from ekosistem per owner decision. aggregateRating
// is the one field kept live from Prisma (review_stats): review counts are genuinely
// operational data, not catalog content, same distinction applied throughout this
// migration for the tour-detail and destination pages.
import { getEcosystemTourPackageDetail } from "@/lib/ecosystemContent/tourPackageDetail";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";

function roundRating(value: number) {
  return Number(value.toFixed(1));
}

function resolveEcosystemSlug(bareSlug: string): string {
  if (bareSlug.includes("tours/")) return bareSlug;
  return `tours/from-surabaya/${bareSlug}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const { slug } = await context.params;

  const detail = await getEcosystemTourPackageDetail(resolveEcosystemSlug(slug));

  if (!detail) {
    return Response.json({ error: "Package not found" }, { status: 404 });
  }

  const pkg = detail.product;
  const googleStats = await getPublicAggregateRating();

  const travelerRequirements = [
    "Moderate fitness required (night hikes, uneven surfaces)",
    "Warm clothing (5–10°C before sunrise)",
    "Sturdy hiking shoes",
  ];

  const hasIjen = (pkg.route ?? []).some((name: string) =>
    name.toLowerCase().includes("ijen")
  );

  if (hasIjen) {
    travelerRequirements.push("Printed passport copy required for Ijen permit");
  }

  const mapped: any =
    all === "true"
      ? detail
      : {
          id: pkg.packageId,
          slug: pkg.slug,
          name: pkg.name,
          shortLabel: `${pkg.durationDays || 0}D${pkg.durationNights || 0}N ${(pkg.route ?? []).join(" • ")}`,
          description: pkg.description || "",
          originCity: pkg.originCity || "",
          endCity: pkg.endCity || "",
          durationDays: pkg.durationDays || 0,
          durationNights: pkg.durationNights || 0,

          tripRef: {
            tripId: `trip-${pkg.packageId}`,
            href: `/jvto_master/trips/trip-${pkg.packageId}.json`,
          },

          keyExperiences: (pkg.keyExperiences ?? []).map((k: any) => k.highlight ?? k.name ?? ""),
          physicality: pkg.physicalDifficulty || "",

          inclusions: pkg.inclusions ?? [],
          exclusions: pkg.exclusions ?? [],

          addOns: (pkg.addOns ?? []).map((addon: any) => ({
            name: addon.name ?? "",
            description: addon.description ?? "",
            price: addon.price ?? 0,
          })),

          offers: pkg.offers,

          aggregateRating: {
            ratingValue: googleStats ? roundRating(googleStats.rating) : 4.8,
            reviewCount: googleStats?.count ?? 138,
            sourceExamples: [
              {
                text: "",
                author: "",
                source: "",
              },
            ],
          },

          travelerRequirements: travelerRequirements,

          marketing: {
            perfectFor: pkg.marketing?.perfectFor ?? [
              "Couples, friends, and small private groups seeking an intense volcano & waterfall experience in East Java",
            ],
            highlightsBullets: pkg.marketing?.highlightsBullets ?? [],
            safetyPositioning: [
              pkg.marketing?.safetyPositioning ||
                "Locally operated, professional guides, safety gear included",
            ],
            tone: "",
          },
          operationalComplexityNote: pkg.operationalComplexityNote ? [pkg.operationalComplexityNote] : [],
          provider: {
            name: "Java Volcano Tour Operator (JVTO)",
            legalEntity: "PT. JAVA VOLCANO RENDEZVOUS",
            headOffice: "Bondowoso, East Java, Indonesia",
            license: "1102230032918",
          },
        };

  if (searchParams.get("download") === "true") {
    return new Response(JSON.stringify(mapped, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="product-${pkg.slug}.json"`,
      },
    });
  }

  return Response.json(mapped);
}
