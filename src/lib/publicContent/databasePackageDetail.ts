import type { TourPackageDetail } from "@/interfaces";
import { prisma } from "@/lib/prisma";

type GlobalGearRow = {
  id: bigint;
  destination_id: bigint | null;
  gear: string;
  type: string;
  created_at: Date | null;
  updated_at: Date | null;
};

function ucwords(str: string) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function replaceBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, currentValue) =>
      typeof currentValue === "bigint" ? currentValue.toString() : currentValue,
    ),
  ) as T;
}

export async function getPackageDetailFromDatabase(
  slug: string,
): Promise<TourPackageDetail | null> {
  const pkg = await prisma.packages.findUnique({
    where: { slug },
    include: {
      start_destination: true,
      end_destination: true,
      durations: true,
      package_categories: true,
      package_destinations: {
        include: {
          destinations: {
            include: { activities: true, destination_gears: true },
          },
        },
        orderBy: { sort_order: "asc" },
      },
      package_prices: {
        include: { price_tiers: true },
        orderBy: { price: "asc" },
      },
      package_includes: {
        include: { item_includes: true },
      },
      package_excludes: {
        include: { item_excludes: true },
      },
      package_addons: { include: { addons: true } },
      package_assets: { include: { asset: true } },
      package_faqs: true,
      package_hotel_options: {
        orderBy: { day_no: "asc" },
        include: {
          hotels: {
            include: { destinations: true },
          },
        },
      },
      package_itinerary_days: {
        orderBy: { day_no: "asc" },
        include: {
          package_itinerary_day_details: {
            orderBy: { sort_order: "asc" },
            include: {
              activities: {
                include: { destinations: true, activity_categories: true },
              },
              locations_from: true,
              locations_to: true,
            },
          },
          hotels: true,
          routes: {
            include: {
              route_details: {
                orderBy: { seq: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!pkg) {
    return null;
  }

  const globalGears = await prisma.$queryRaw<GlobalGearRow[]>`
    SELECT * FROM destination_gears 
    WHERE destination_id IS NULL
  `;

  const excludedDestinationIds = new Set([3, 4]);
  const allTiers = (pkg.package_prices ?? [])
    .map((price) => price.price_tiers)
    .filter((tier) => tier != null);

  const calculatedMinPax =
    allTiers.length > 0
      ? Math.min(...allTiers.map((tier) => tier?.min_pax ?? 1))
      : 1;

  const calculatedMaxPax = 100;

  return replaceBigInt({
    id: Number(pkg.id),
    packageId: pkg.code,
    type: "package",
    version: "1.0.0",
    meta: {
      createdFrom: {
        productFile: `Product ${pkg.name}.json`,
        tripFile: `Trip ${pkg.name}.json`,
      },
    },
    product: {
      id: Number(pkg.id),
      packageId: pkg.code,
      slug: pkg.slug,
      name: pkg.name,
      seoTitle: pkg.seo_title ?? "",
      seoDescription: pkg.seo_meta ?? "",
      shortLabel: pkg.short_label,
      originCity: pkg.start_destination?.name ?? "",
      endCity: pkg.end_destination?.name ?? "",
      category_id:
        Number(pkg.package_category_id ?? 0) === 1 ? "reluger" : "student",
      category: pkg.package_categories?.name ?? "",
      durationId: pkg.durations?.id ?? null,
      durationDays: pkg.durations?.day ?? 0,
      durationNights: pkg.durations?.night ?? 0,
      marketedDurationLabel: `${pkg.durations?.day ?? 0}D${pkg.durations?.night ?? 0}N`,
      route: (pkg.package_destinations ?? [])
        .filter(
          (packageDestination) =>
            !excludedDestinationIds.has(Number(packageDestination.destination_id)),
        )
        .map((destination) => destination.destinations?.name ?? ""),
      tripRef: `/trips/trip-${pkg.code}.json`,
      description: pkg.description ?? "",
      keyExperiences: (pkg.package_destinations ?? [])
        .filter(
          (packageDestination) =>
            !excludedDestinationIds.has(Number(packageDestination.destination_id)),
        )
        .map((destination) => ({
          name: destination.destinations?.name ?? "",
          highlight: destination.destinations?.highlight ?? "",
        })),
      physicalDifficulty: pkg.physicality ?? "",
      offers: {
        currency: "IDR",
        aggregateOffer: {
          lowPrice:
            Math.min(
              ...(pkg.package_prices ?? [])
                .map((price) => price.price)
                .filter(
                  (price): price is number => typeof price === "number",
                ),
            ) || 0,
          highPrice:
            Math.max(
              ...(pkg.package_prices ?? [])
                .map((price) => price.price)
                .filter(
                  (price): price is number => typeof price === "number",
                ),
            ) || 0,
        },
        tiers: (pkg.package_prices ?? []).map((price, key) => ({
          sku: `${pkg.code}-${key + 1}`,
          paxMin: price.price_tiers?.min_pax ?? 0,
          paxMax: price.price_tiers?.max_pax ?? 0,
          pricePerPerson: price.price ?? 0,
        })),
      },
      inclusions: (pkg.package_includes ?? []).map(
        (include) => include.item_includes?.item ?? "",
      ),
      exclusions: (pkg.package_excludes ?? []).map(
        (exclude) => exclude.item_excludes?.item ?? "",
      ),
      travelerRequirements: Array.isArray(pkg.traveler_requirements)
        ? pkg.traveler_requirements
            .map((item) => item?.trim())
            .filter((item) => item && item.length > 0)
        : [],
      addOns: (pkg.package_addons ?? []).map((addon) => ({
        id: addon.addons?.id,
        name: addon.addons?.is_transport
          ? `Transport to ${ucwords(addon.addons?.name || "")}`
          : addon.addons?.name || "",
        type:
          Number(addon.addons?.id ?? 0) === 2
            ? "madakaripura"
            : addon.addons?.is_transport
              ? "transport"
              : null,
        description: addon.addons?.is_transport
          ? `Transport to ${ucwords(addon.addons?.name || "")} - ${ucwords(
              addon.addons?.transport_type || "",
            )} Car (${
              addon.addons?.transport_type === "small"
                ? "1-3 Pax"
                : addon.addons?.transport_type === "medium"
                  ? "4-9 Pax"
                  : "10 Pax Above"
            })`
          : "",
        transportType: addon.addons?.transport_type ?? null,
        transportDestination: addon.addons?.name ?? null,
        price: addon.addons?.price ?? 0,
      })),
      accommodationPlan: (pkg.package_hotel_options ?? []).map((hotel) => ({
        night: hotel.day_no ?? 0,
        name: hotel.hotels?.name ?? "",
        area: hotel.hotels?.destinations?.name ?? "",
        image: hotel.hotels
          ? `https://legacy.javavolcano-touroperator.com/assets/img/hotels/${hotel.hotels.banner}`
          : "",
      })),
      gear: {
        provided: [
          ...(globalGears ?? [])
            .filter((gear) => gear.type === "provided")
            .map((gear) => gear.gear),
          ...(pkg.package_destinations ?? [])
            .flatMap(
              (packageDestination) =>
                packageDestination.destinations?.destination_gears ?? [],
            )
            .filter((gear) => gear.type === "provided")
            .map((gear) => gear.gear),
        ],
        recommended: [
          ...(globalGears ?? [])
            .filter((gear) => gear.type === "recommended")
            .map((gear) => gear.gear),
          ...(pkg.package_destinations ?? [])
            .flatMap(
              (packageDestination) =>
                packageDestination.destinations?.destination_gears ?? [],
            )
            .filter((gear) => gear.type === "recommended")
            .map((gear) => gear.gear),
        ],
      },
      itineraryDays: (pkg.package_itinerary_days ?? []).map((day) => ({
        day: day.day_no ?? 0,
        title: day.title ?? "",
        summary: day.activity ?? "",
        activities:
          day.routes?.route_details?.map((activity) => {
            const baseActivity = {
              type: activity.type,
              name: activity.name,
              description: activity.activity,
              timeWindow: activity.time_or_label,
              durationMinutes: activity.duration_minutes,
            };

            if (activity.type === "TravelAction") {
              return {
                ...baseActivity,
                fromLocation: activity.from_location,
                toLocation: activity.to_location,
                destination: activity.location,
              };
            }

            return {
              ...baseActivity,
              location: activity.location,
            };
          }) ?? [],
        mealsPlan: {
          breakfast: day.meal_breakfast ? "included" : "own expense",
          lunch: day.meal_lunch ? "included" : "own expense",
          dinner: day.meal_dinner ? "included" : "own expense",
        },
        mealsNotes: day.routes?.meals_notes ?? "",
        overnight: day.hotel_id ? day.routes?.end_area ?? null : null,
      })),
      gallery: (pkg.package_assets ?? [])
        .filter((asset) => asset.asset?.type === "image")
        .map((asset) => asset.asset?.url ?? ""),
      imageUrl:
        (pkg.package_assets ?? []).find(
          (asset) => asset.asset?.type === "image" && asset.is_primary,
        )?.asset?.url ?? "",
      tags: Array.isArray(pkg.tags)
        ? pkg.tags.map((item) => item?.trim()).filter((item) => item && item.length > 0)
        : [],
      aggregateRating: {
        ratingValue: 0,
        reviewCount: 0,
      },
      marketing: {
        perfectFor: Array.isArray(pkg.perfect_for)
          ? pkg.perfect_for
              .map((item) => item?.trim())
              .filter((item) => item && item.length > 0)
          : [],
        highlightsBullets: Array.isArray(pkg.highlights_bullets)
          ? pkg.highlights_bullets
              .map((item) => item?.trim())
              .filter((item) => item && item.length > 0)
          : [],
        safetyPositioning: pkg.safety_positioning ?? "",
        uniqueSellingPoints: Array.isArray(pkg.unique_selling_points)
          ? pkg.unique_selling_points
              .map((item) => item?.trim())
              .filter((item) => item && item.length > 0)
          : [],
      },
      operationalComplexityNote: pkg.operational_complexity_note ?? "",
      provider: {
        brand: "Java Volcano Tour Operator (JVTO)",
        legalEntity: "PT Java Volcano Rendezvous",
        nib: "1102230032918",
        tdup: "1102230032918",
        official: {
          website: "https://javavolcano-touroperator.com",
          whatsapp: "+62 822-4478-8833",
          email: "hello@javavolcano-touroperator.com",
        },
        policyRef: {
          booking: "/policy/booking.json",
          inclusions: "/policy/inclusions_exclusions.json",
        },
        policyVersion: "2025-11-09",
      },
      compliance: {
        destinationsWhitelist: true,
        itineraryTablesGenerated: true,
        healthScreeningIncluded: (pkg.package_destinations ?? []).some(
          (packageDestination) => Number(packageDestination.destination_id) === 2,
        ),
        touristPoliceSupport: true,
      },
      channelMetadata: {
        internalPackageId: pkg.code,
        orderChannelEnabled: {
          JVTO: true,
          KLOOK: false,
          TRAVELOKA: false,
          TIKETCOM: false,
          OTHERS: false,
        },
        externalPackageIds: {
          klook: "",
          traveloka: "",
          tiketcom: "",
        },
        isFreesale: true,
        requiresAvailabilityCheck: false,
        supportedPickupCities: pkg.start_destination?.name
          ? [pkg.start_destination.name]
          : [],
        supportedDropoffCities: pkg.end_destination?.name
          ? [pkg.end_destination.name]
          : [],
        languageOffered: ["en"],
        status: "active",
        minLeadTimeHours: 24,
        maxPaxRecommended: calculatedMaxPax,
        minPaxOperational: calculatedMinPax,
      },
      _cms: {
        contentType: "tour-package",
        version: "2.0",
        created: "2025-01-15T00:00:00Z",
        lastModified: "2025-01-15T00:00:00Z",
        status: "published",
        owner: "content-team",
        i18nReady: true,
        seoOptimized: true,
        schemaType: "TouristTrip",
      },
    },
    trip: {
      vehiclePlan: {
        primary: [
          {
            type: "MPV",
            model: "Toyota Avanza/Innova",
            banner:
              "https://legacy.javavolcano-touroperator.com/assets/img/cars/avanza.png",
            maxPax: 3,
            baggageCapacity: "3 medium bags",
            features: ["AC", "Charging ports"],
          },
          {
            type: "Hiace",
            model: "Toyota Hiace",
            banner:
              "https://legacy.javavolcano-touroperator.com/assets/img/cars/hiace.png",
            maxPax: 11,
            baggageCapacity: "11 medium bags",
            features: ["AC", "Spacious legroom"],
          },
        ],
        jeepRequiredAt: ["mount-bromo"],
        jeepSpecs: {
          type: "4WD Jeep",
          capacity: "4-6 pax",
          inclusions: [
            "Experienced driver",
            "Kingkong Hill access",
            "Vintage Jeep experience",
          ],
        },
      },
    },
  }) as unknown as TourPackageDetail;
}
