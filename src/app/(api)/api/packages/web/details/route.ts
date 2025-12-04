// app/api/packages/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (slug == null) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    const pkg = await prisma.packages.findUnique({
      where: { slug: slug },
      include: {
        start_destination: true,
        end_destination: true,
        durations: true,
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
      return NextResponse.json(
        { message: "Paket tidak ditemukan atau belum dipublikasikan " + slug },
        { status: 404 }
      );
    }
    const globalGears = await prisma.$queryRaw<
      Array<{
        id: bigint;
        destination_id: bigint | null;
        gear: string;
        type: string;
        created_at: Date | null;
        updated_at: Date | null;
      }>
    >`
  SELECT * FROM destination_gears 
  WHERE destination_id IS NULL
`;
    function ucwords(str: string) {
      if (!str) return "";
      str = str.toLowerCase();
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }

    function replaceBigInt(obj: any): any {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }

    const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);

    return NextResponse.json(
      replaceBigInt({
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
          shortLabel: pkg.short_label,
          originCity: pkg.start_destination?.name ?? "",
          endCity: pkg.end_destination?.name ?? "",
          durationId: pkg.durations?.id ?? null,
          durationDays: pkg.durations?.day ?? 0,
          durationNights: pkg.durations?.night ?? 0,
          marketedDurationLabel: `${pkg.durations?.day ?? 0}D${
            pkg.durations?.night ?? 0
          }N`,
          route: (pkg.package_destinations ?? [])
            .filter(
              (pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id))
            )
            .map((dest) => dest.destinations?.name ?? ""),
          tripRef: `/trips/trip-${pkg.code}.json`,
          description: pkg.description ?? "",
          keyExperiences: (pkg.package_destinations ?? [])
            .filter(
              (pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id))
            )
            .map(
              (dest) => dest.destinations?.activities?.[0]?.activity_name ?? ""
            ),
          physicalDifficulty: pkg.physicality ?? "",
          offers: {
            currency: "IDR",
            aggregateOffer: {
              lowPrice:
                Math.min(
                  ...(pkg.package_prices ?? [])
                    .map((p) => p.price)
                    .filter((v): v is number => typeof v === "number")
                ) || 0,
              highPrice:
                Math.max(
                  ...(pkg.package_prices ?? [])
                    .map((p) => p.price)
                    .filter((v): v is number => typeof v === "number")
                ) || 0,
            },
            tiers: (pkg.package_prices ?? []).map((price, key) => ({
              sku: pkg.code + "-" + (key + 1),
              paxMin: price.price_tiers?.min_pax ?? 0,
              paxMax: price.price_tiers?.max_pax ?? 0,
              pricePerPerson: price.price ?? 0,
            })),
          },
          inclusions: (pkg.package_includes ?? []).map(
            (inc) => inc.item_includes?.item ?? ""
          ),
          exclusions: (pkg.package_excludes ?? []).map(
            (exc) => exc.item_excludes?.item ?? ""
          ),
          travelerRequirements: Array.isArray(pkg.traveler_requirements)
            ? pkg.traveler_requirements
                .map((s) => s?.trim())
                .filter((s) => s && s.length > 0)
            : [],
          addOns: (pkg.package_addons ?? []).map((addon: any) => ({
            id: addon.addons?.id,
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
            price: addon.addons?.price ?? 0,
          })),
          accommodationPlan:
            (pkg.package_hotel_options ?? []).map((h: any) => ({
              night: h.day_no ?? 0,
              area: h.hotels?.destinations?.name ?? "",
              hotel: h.hotels?.name ?? "",
            })) ?? [],
          gear: {
            provided: [
              ...(globalGears ?? [])
                .filter((g) => g.type === "provided")
                .map((g) => g.gear),
              ...(pkg.package_destinations ?? [])
                .flatMap((pd) => pd.destinations?.destination_gears ?? [])
                .filter((g) => g.type === "provided")
                .map((g) => g.gear),
            ],
            recommended: [
              ...(globalGears ?? [])
                .filter((g) => g.type === "recommended")
                .map((g) => g.gear),
              ...(pkg.package_destinations ?? [])
                .flatMap((pd) => pd.destinations?.destination_gears ?? [])
                .filter((g) => g.type === "recommended")
                .map((g) => g.gear),
            ],
          },
          itineraryDays:
            (pkg.package_itinerary_days ?? []).map((day: any) => {
              return {
                day: day.day_no ?? 0,
                title: day.title ?? "",
                summary: day.activity ?? "",
                activities:
                  day.routes?.route_details?.map((act: any) => {
                    const type = act.type;

                    if (type === "TravelAction") {
                      return {
                        type: type,
                        name: act.name,
                        description: act.activity,
                        fromLocation: act.from_location,
                        toLocation: act.to_location,
                        destination: act.location,
                        timeWindow: act.time_or_label,
                        durationMinutes: act.duration_minutes,
                      };
                    } else {
                      return {
                        type: type,
                        name: act.name,
                        description: act.activity,
                        location: act.location,
                        timeWindow: act.time_or_label,
                        durationMinutes: act.duration_minutes,
                      };
                    }
                  }) ?? [],
                mealsPlan: {
                  breakfast: day.meal_breakfast ? "included" : "own expense",
                  lunch: day.meal_lunch ? "included" : "own expense",
                  dinner: day.meal_dinner ? "included" : "own expense",
                },
                mealsNotes: day.routes?.meals_notes ?? "",
                overnight: day.hotel_id ? day.routes?.end_area ?? null : null,
              };
            }) ?? [],
          gallery: (pkg.package_assets ?? [])
            .filter((pa: any) => pa.asset?.type === "image")
            .map((pa: any) => pa.asset?.url ?? ""),
          imageUrl:
            (pkg.package_assets ?? []).filter(
              (pa: any) => pa.asset?.type === "image" && pa.is_primary
            )[0]?.asset?.url ?? "",
          tags: Array.isArray(pkg.tags)
            ? pkg.tags.map((s) => s?.trim()).filter((s) => s && s.length > 0)
            : [],
          aggregateRating: {
            ratingValue: 0,
            reviewCount: 0,
          },
          marketing: {
            perfectFor: Array.isArray(pkg.perfect_for)
              ? pkg.perfect_for
                  .map((s) => s?.trim())
                  .filter((s) => s && s.length > 0)
              : [],
            highlightsBullets: Array.isArray(pkg.highlights_bullets)
              ? pkg.highlights_bullets
                  .map((s) => s?.trim())
                  .filter((s) => s && s.length > 0)
              : [],
            safetyPositioning: pkg.safety_positioning ?? "",
            uniqueSellingPoints: Array.isArray(pkg.unique_selling_points)
              ? pkg.unique_selling_points
                  .map((s) => s?.trim())
                  .filter((s) => s && s.length > 0)
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
              email: "info@javavolcano-touroperator.com",
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
              (pd) => Number(pd.destination_id) === 2
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
            maxPaxRecommended: 11,
            minPaxOperational: 2,
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
        // trip: {
        //   id: "",
        //   name: "",
        //   packageRef: "",
        //   start: {
        //     city: "",
        //     pickupOptions: {
        //       airport: { required: [], meetingPoint: "" },
        //       hotel: { required: [], notes: "" },
        //       train: { required: [], meetingPoint: "" },
        //     },
        //     latestPickupGuidance: "",
        //     orientationTime: "",
        //   },
        //   end: {
        //     city: "",
        //     dropoffOptions: [],
        //     safeFlightNote: "",
        //     estimatedArrival: "",
        //   },
        //   route: [],
        //   accommodationPlan: [],
        //   gearProvided: [],
        //   gearRecommended: [],
        //   itineraryDays: [],
        //   crewRolesNeeded: [],
        //   vehiclePlan: {
        //     primary: [],
        //     jeepRequiredAt: [],
        //     jeepSpecs: {},
        //   },
        //   operationalNotes: {
        //     healthRequirements: [],
        //     environmentalRisks: [],
        //     safetyMitigation: [],
        //   },
        //   handoverNotes: [],
        //   emergencyProtocols: {
        //     medicalEmergency: "",
        //     weatherDisruption: "",
        //     vehicleBreakdown: "",
        //     beachSafety: "",
        //     guestFatigue: "",
        //   },
        // },
      }),
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/packages/details error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail paket" },
      { status: 500 }
    );
  }
}
