import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");

  const pkg = await prisma.packages.findFirst({
    where: { slug: params.slug },
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
  const hasIjen = serialized.package_destinations?.some(
    (d: any) => Number(d.destination_id) == 2
  );
  const hasBromo = serialized.package_destinations?.some(
    (d: any) => Number(d.destination_id) == 1
  );
  const hasWaterfall = serialized.package_destinations?.some(
    (d: any) => Number(d.destination_id) == 7 || Number(d.destination_id) == 6
  );

  const gearRecommended = [
    "Warm jacket, beanie, gloves (5–10°C before sunrise)",
  ];
  const crewRolesNeeded = [
    "Driver (full-trip)",
    "Escort Guide / English-speaking driver-guide",
  ];

  function formatTime(timeString) {
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
  const operationalNotes = {
    healthRequirements: [],
    environmentalRisks: [],
    safetyMitigation: [],
  };

  // Ijen
  if (hasIjen) {
    operationalNotes.healthRequirements.push(
      "Doctor’s health certificate required for Ijen entry (we arrange this).",
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

  const mapped =
    all === "true"
      ? serialized
      : {
          tripId: serialized.code,
          name: serialized.name,
          duration: {
            days: serialized.durations?.day,
            nights: serialized.durations?.night,
            iso8601: serialized.durations
              ? `P${serialized.durations.day}D${serialized.durations.night}N`
              : "",
          },
          start: {
            city: serialized.start_destination?.name,
            pickupOptions:
              serialized.start_destination?.id == 3
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
            city: serialized.end_destination?.name,
            dropoffOptions:
              serialized.end_destination?.id == 3
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
              serialized.end_destination?.id == 3
                ? `For flights from Ngurah Rai International Airport (DPS) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`
                : `For flights from Juanda International Airport (SUB) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`,
          },
          route:
            serialized.package_destinations?.map(
              (d: any) => d.destinations?.name
            ) || [],
          accommodationPlan:
            serialized.package_hotel_options?.map((h: any) => ({
              night: h.day_no,
              area: h.hotels?.destinations.name,
              hotel: h.hotels?.name,
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
                day: day.day_no,
                title: day.title,
                summary: day.activity,
                mealsIncluded: mealsIncluded,
                activities:
                  day.package_itinerary_day_details?.map((act: any) => {
                    const type =
                      act.activities.activity_category_id == 2
                        ? "TouristAttractionVisit"
                        : act.activities.activity_category_id == 3 &&
                          act.notes.toLowerCase().includes("check in")
                        ? "CheckInAction"
                        : act.activities.activity_category_id == 4
                        ? "MealsAction"
                        : "TravelAction";

                    if (type === "TravelAction") {
                      const travelData: any = {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        fromLocation: { name: act.locations_from?.name },
                        toLocation: { name: act.locations_to?.name },
                        destination: act.destination_slug
                          ? {
                              slug: act.destination_slug,
                              name: act.destination_name || "",
                            }
                          : undefined,
                        description: act.notes || "",
                      };

                      if (Number(act.activities.activity_category_id) === 5) {
                        travelData.transport = act.activities.activity_name;
                      }

                      return travelData;
                    }

                    if (type === "CheckInAction") {
                      const todayHotel = day.hotels?.name;
                      return {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        location: { name: todayHotel },
                        description: act.notes || "",
                      };
                    }

                    if (type === "MealsAction") {
                      return {
                        type,
                        timeApprox: formatTime(act.time) || "",
                        location: { name: "meals location" },
                        description: act.notes || "",
                        location: { name: act.locations_from?.name },
                      };
                    }

                    if (type === "TouristAttractionVisit") {
                      return {
                        type,
                        timeApprox: formatTime(act.time),
                        location: {
                          slug: act.activities.destinations?.slug || "",
                          name: act.activities.destinations?.name || "",
                        },
                        description: act.notes || "",
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
