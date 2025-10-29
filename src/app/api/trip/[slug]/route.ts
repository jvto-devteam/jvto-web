import { activities } from './../../../../generated/prisma/index.d';
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

  let gearRecommended = ["Warm jacket, beanie, gloves (5–10°C before sunrise)"];

  // Tambahkan item berdasarkan destinasi
  if (hasIjen || hasBromo) {
    gearRecommended.push("Sturdy hiking shoes with grip");
    gearRecommended.push("Spare socks");
  }

  if (hasWaterfall) {
    gearRecommended.push("Waterproof bag for waterfall areas");
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
                      notes: "Pickup time coordinated (latest 08:00 on Day 1)",
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
            serialized.package_itinerary_days?.map((day: any) => ({
              day: day.day_no,
              title: day.title,
              summary: day.activity,
              activities:
                day.package_itinerary_day_details?.map((act: any) => ({
                  type: act.activities.activity_category_id,
                  timeApprox: act.time || "",
                  fromLocation: { name: act.from_location || "" },
                  toLocation: { name: act.to_location || "" },
                  destination: {
                    slug: act.destination_slug || "",
                    name: act.destination_name || "",
                  },
                  transport: act.transport || "",
                  location: {
                    slug: act.location_slug || "",
                    name: act.location_name || "",
                  },
                  description: act.description || "",
                })) || [],
            })) || [],
          crewRolesNeeded: [],
          operationalNotes: {
            healthRequirements: [],
            environmentalRisks: [],
            safetyMitigation: [],
          },
        };
  return Response.json(mapped);
}
