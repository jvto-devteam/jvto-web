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
        include: {
          hotels: {
            include: { destinations: true },
          },
        },
      },
      package_images: true,
      package_includes: { include: { item_includes: true } },
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

  const serialized = JSON.parse(
    JSON.stringify(pkg, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  // ✅ FIXED: Safe array checks with strict equality
  const hasIjen = Array.isArray(serialized.package_destinations)
    ? serialized.package_destinations.some(
        (d) => Number(d.destination_id) === 2
      )
    : false;

  const hasBromo = Array.isArray(serialized.package_destinations)
    ? serialized.package_destinations.some(
        (d) => Number(d.destination_id) === 1
      )
    : false;

  const hasWaterfall = Array.isArray(serialized.package_destinations)
    ? serialized.package_destinations.some(
        (d) => Number(d.destination_id) === 7 || Number(d.destination_id) === 6
      )
    : false;

  const gearRecommended = [
    "Warm jacket, beanie, gloves (5–10°C before sunrise)",
  ];

  const crewRolesNeeded = [
    "Driver (full-trip)",
    "Escort Guide / English-speaking driver-guide",
  ];

  function formatTime(timeString: string | null | undefined) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  }

  // Tambahkan item berdasarkan destinasi
  if (hasIjen) {
    crewRolesNeeded.push("Local Ijen Trekking Guide (licensed crater guide)");
  }
  if (hasBromo) {
    crewRolesNeeded.push("4WD Jeep Driver (Bromo Sunrise segment)");
  }
  if (hasIjen || hasBromo) {
    gearRecommended.push("Sturdy hiking shoes with grip");
    gearRecommended.push("Spare socks");
  }

  if (hasWaterfall) {
    gearRecommended.push("Waterproof bag for waterfall areas");
    crewRolesNeeded.push("Local Waterfall Guide");
  }

  type OperationalNotes = {
    healthRequirements: string[];
    environmentalRisks: string[];
    safetyMitigation: string[];
  };

  const operationalNotes: OperationalNotes = {
    healthRequirements: [],
    environmentalRisks: [],
    safetyMitigation: [],
  };

  // Ijen
  if (hasIjen) {
    operationalNotes.healthRequirements.push(
      "Doctor's health certificate required for Ijen entry (we arrange this).",
      "Not recommended for guests with severe respiratory or cardiac issues."
    );
    operationalNotes.environmentalRisks.push(
      "Volcanic gas exposure at Ijen (gas mask provided)"
    );
    operationalNotes.safetyMitigation.push(
      "Gas mask sanitized after each use",
      "Headlamps for pre-dawn hiking"
    );
  }

  // Bromo
  if (hasBromo) {
    operationalNotes.environmentalRisks.push(
      "Cold temperatures (as low as ~5°C at Bromo sunrise)"
    );
  }

  // Waterfall (Madakaripura, Tumpak Sewu)
  if (hasWaterfall) {
    operationalNotes.environmentalRisks.push(
      "Wet, slippery rocks at Waterfall"
    );
    operationalNotes.safetyMitigation.push(
      "Local waterfall guide required for canyon safety"
    );
  }

  // ✅ FIXED: Strict equality untuk ID checks
  const startDestId = Number(serialized.start_destination?.id);
  const endDestId = Number(serialized.end_destination?.id);

  const mapped: any =
    all === "true"
      ? serialized
      : {
          tripId: serialized.code,
          name: serialized.name,
          duration: {
            days: serialized.durations?.day || 0,
            nights: serialized.durations?.night || 0,
            iso8601: serialized.durations
              ? `P${serialized.durations.day}D${serialized.durations.night}N`
              : "",
          },
          start: {
            city: serialized.start_destination?.name || "",
            pickupOptions:
              startDestId === 3
                ? [
                    {
                      type: "airport",
                      label: "Ngurah Rai International Airport (DPS)",
                      notes: "Send flight number e.g. QZ551, KUL-DPS",
                    },
                    {
                      type: "hotel",
                      label: "Any hotel in Bali (Kuta, Seminyak, Ubud, etc.)",
                      notes: "Send flight number e.g. TR264, SIN-SUB",
                    },
                  ]
                : [
                    {
                      type: "airport",
                      label: "Juanda International Airport (SUB)",
                      notes: "Send flight number e.g. TR264, SIN-SUB",
                    },
                    {
                      type: "hotel",
                      label: "Any hotel in Surabaya City",
                      notes: "Pickup time coordinated (latest 12:00 on Day 1)",
                    },
                    {
                      type: "train",
                      label: "Gubeng Train Station",
                      notes: "Provide train name & ETA",
                    },
                  ],
          },
          end: {
            city: serialized.end_destination?.name || "",
            dropoffOptions:
              endDestId === 3
                ? [
                    "Hotel in Bali (Kuta, Seminyak, Ubud, etc.)",
                    "Ngurah Rai International Airport (DPS)",
                  ]
                : [
                    "Hotel in Surabaya",
                    "Train Station Surabaya",
                    "Juanda International Airport (SUB)",
                  ],
            recommendedDepartureNote:
              endDestId === 3
                ? `For flights from Ngurah Rai International Airport (DPS) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`
                : `For flights from Juanda International Airport (SUB) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`,
          },
          route:
            serialized.package_destinations?.map(
              (d: any) => d.destinations?.name || ""
            ) || [],
          accommodationPlan:
            serialized.package_hotel_options?.map((h: any) => ({
              night: h.day_no || 0,
              area: h.hotels?.destinations?.name || "",
              hotel: h.hotels?.name || "",
            })) || [],
          gearProvided: hasIjen
            ? ["Gas mask (sanitized after each use)", "Trekking poles"]
            : [],
          gearRecommended: gearRecommended,
          itineraryDays:
            serialized.package_itinerary_days?.map((day: any) => {
              // Buat array mealsIncluded berdasarkan boolean
              const mealsIncluded: string[] = [];
              if (day.meal_breakfast) mealsIncluded.push("Breakfast");
              if (day.meal_lunch) mealsIncluded.push("Lunch");
              if (day.meal_dinner) mealsIncluded.push("Dinner");

              return {
                day: day.day_no || 0,
                title: day.title || "",
                summary: day.activity || "",
                mealsIncluded: mealsIncluded,
                activities:
                  day.package_itinerary_day_details?.map((act: any) => {
                    // ✅ FIXED: Safe access dengan optional chaining
                    const actCatId = Number(act.activities?.activity_category_id);
                    const actNotes = act.notes || "";

                    const type =
                      actCatId === 2
                        ? "TouristAttractionVisit"
                        : actCatId === 3 &&
                          actNotes.toLowerCase().includes("check in")
                        ? "CheckInAction"
                        : actCatId === 4
                        ? "MealsAction"
                        : "TravelAction";

                    if (type === "TravelAction") {
                      const travelData: any = {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        fromLocation: { name: act.locations_from?.name || "" },
                        toLocation: { name: act.locations_to?.name || "" },
                        destination: act.destination_slug
                          ? {
                              slug: act.destination_slug,
                              name: act.destination_name || "",
                            }
                          : undefined,
                        description: actNotes,
                      };

                      if (actCatId === 5) {
                        travelData.transport = act.activities?.activity_name || "";
                      }

                      return travelData;
                    }

                    if (type === "CheckInAction") {
                      const todayHotel = day.hotels?.name || "";
                      return {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        location: { name: todayHotel },
                        description: actNotes,
                      };
                    }

                    if (type === "MealsAction") {
                      return {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        description: actNotes,
                        location: { name: act.locations_from?.name || "" },
                      };
                    }

                    if (type === "TouristAttractionVisit") {
                      return {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        location: {
                          slug: act.activities?.destinations?.slug || "",
                          name: act.activities?.destinations?.name || "",
                        },
                        description: actNotes,
                      };
                    }
                  }) || [],
              };
            }) || [],
          crewRolesNeeded: crewRolesNeeded,
          operationalNotes: operationalNotes,
        };

  if (searchParams.get("download") === "true") {
    return new Response(JSON.stringify(mapped, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="trip-${serialized.slug}.json"`,
      },
    });
  }

  return Response.json(mapped);
}