import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const { slug } = await context.params; // ✅ await the Promise

  const pkg = await prisma.packages.findFirst({
    where: { slug },
    include: {
      order_channels: true,
      durations: true,
      start_destination: true,
      end_destination: true,
      package_addons: { include: { addons: true } },
      package_categories: true,
      package_destinations: {
        include: {
          destinations: {
            include: { activities: true },
          },
        },
      },
      package_excludes: { include: { item_excludes: true } },
      package_hotel_options: {
        orderBy: { day_no: "asc" },
        include: { hotels: true },
      },
      package_includes: { include: { item_includes: true } },
      package_itinerary_days: {
        orderBy: { day_no: "asc" },
        include: {
          package_itinerary_day_details: {
            include: { activities: true },
          },
        },
      },
      package_prices: {
        include: { price_tiers: true },
        orderBy: {
          price_tiers: {
            min_pax: "asc",
          },
        },
      },
    },
  });

  if (!pkg) {
    return Response.json({ error: "Package not found" }, { status: 404 });
  }

  const googleStats = await prisma.review_stats.findUnique({ where: { source: "google" } });

  const serialized = JSON.parse(
    JSON.stringify(pkg, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  // ✅ Safe array handling with strict equality
  const routePackage =
    serialized.package_destinations
      ?.filter((d: any) => Number(d.destination_id) !== 3 && Number(d.destination_id) !== 4)
      .map((d: any) => d.destinations?.name)
      .filter(Boolean)
      .join(" • ") || "";

  const keyExperiences =
    serialized.package_destinations
      ?.filter((d: any) => Number(d.destination_id) !== 3 && Number(d.destination_id) !== 4)
      .flatMap((d: any) => d.destinations?.activities || [])
      .map((a: any) => a.activity_name)
      .filter(Boolean) || [];

  function ucwords(str: string) {
    if (!str) return "";
    str = str.toLowerCase();
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  const prices = serialized.package_prices?.map((p: any) => p.price) || [];
  const lowPrice = prices.length ? Math.min(...prices) : 0;
  const highPrice = prices.length ? Math.max(...prices) : 0;

  const travelerRequirements = [
    "Moderate fitness required (night hikes, uneven surfaces)",
    "Warm clothing (5–10°C before sunrise)",
    "Sturdy hiking shoes",
  ];

  const hasIjen = Array.isArray(serialized.package_destinations)
    ? serialized.package_destinations.some(
        (d: any) => Number(d.destination_id) === 2
      )
    : false;

  if (hasIjen) {
    travelerRequirements.push("Printed passport copy required for Ijen permit");
  }

  const mapped: any =
    all === "true"
      ? serialized
      : {
          id: serialized.code,
          slug: serialized.slug,
          name: serialized.name,
          shortLabel: `${serialized.durations?.day || 0}D${serialized.durations?.night || 0}N ${routePackage}`,
          description: serialized.description || "",
          originCity: serialized.start_destination?.name || "",
          endCity: serialized.end_destination?.name || "",
          durationDays: serialized.durations?.day || 0,
          durationNights: serialized.durations?.night || 0,

          tripRef: {
            tripId: `trip-${serialized.code}`,
            href: `/jvto_master/trips/trip-${serialized.code}.json`,
          },

          keyExperiences: keyExperiences,
          physicality: serialized.physicality || "",

          inclusions: (serialized.package_includes || []).map((inc: any) =>
            inc.item_includes?.item?.replace(/<\/?b>/g, "") || ""
          ),

          exclusions: (serialized.package_excludes || []).map((exc: any) =>
            exc.item_excludes?.item?.replace(/<\/?b>/g, "") || ""
          ),

          addOns: (serialized.package_addons || []).map((addon: any) => ({
            name: addon.addons?.is_transport
              ? `Transport to ${ucwords(addon.addons?.name || "")}`
              : addon.addons?.name || "",
            description: addon.addons?.is_transport
              ? `Transport to ${ucwords(addon.addons?.name || "")} - ${ucwords(
                  addon.addons?.transport_type || ""
                )} Car (${
                  addon.addons?.transport_type === "small"
                    ? "1-3 Pax"
                    : addon.addons?.transport_type === "medium"
                    ? "4-9 Pax"
                    : "10 Pax Above"
                })`
              : "",
            price: addon.addons?.price || 0,
          })),

          offers: {
            currency: "IDR",
            aggregateOffer: {
              lowPrice: lowPrice,
              highPrice: highPrice,
              priceCurrency: "IDR",
            },
            tiers: (serialized.package_prices || []).map((p: any) => ({
              sku: `${serialized.code}-${p.price_tiers?.min_pax || 0}-${p.price_tiers?.max_pax || 0}PAX`,
              paxMin: p.price_tiers?.min_pax || 0,
              paxMax: p.price_tiers?.max_pax || 0,
              pricePerPerson: p.price || 0,
              unit: "person",
            })),
          },

          aggregateRating: {
            ratingValue: googleStats?.rating ?? 4.8,
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
            perfectFor: [
              "Couples, friends, and small private groups seeking an intense volcano & waterfall experience in East Java",
            ],
            highlightsBullets: (serialized.package_destinations || [])
              .filter(
                (d: any) => Number(d.destination_id) !== 3 && Number(d.destination_id) !== 4
              )
              .map((d: any) => d.destinations?.highlight || "")
              .filter(Boolean),
            safetyPositioning: [
              "Locally operated, professional guides, safety gear included",
            ],
            tone: "",
          },
          operationalComplexityNote: [],
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
        "Content-Disposition": `attachment; filename="product-${serialized.slug}.json"`,
      },
    });
  }

  return Response.json(mapped);
}