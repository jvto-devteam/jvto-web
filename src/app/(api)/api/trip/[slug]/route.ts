// Migrated 2026-08-18: no internal caller found for this route (checked fetch calls,
// imports, git history) — sourced from ekosistem per owner decision. The gear/crew/
// safety-note business logic below was always hardcoded (never DB-driven) — it's
// re-keyed off destination *names* in the ekosistem route[] array instead of Prisma
// destination_id numbers, same matching intent as before.
import { getEcosystemTourPackageDetail } from "@/lib/ecosystemContent/tourPackageDetail";

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

  const serialized = detail.product;
  const route: string[] = serialized.route ?? [];

  const hasIjen = route.some((name) => name.toLowerCase().includes("ijen"));
  const hasBromo = route.some((name) => name.toLowerCase().includes("bromo"));
  const hasWaterfall = route.some(
    (name) =>
      name.toLowerCase().includes("waterfall") ||
      name.toLowerCase().includes("tumpak") ||
      name.toLowerCase().includes("madakaripura"),
  );

  const gearRecommended = [
    "Warm jacket, beanie, gloves (5–10°C before sunrise)",
  ];

  const crewRolesNeeded = [
    "Driver (full-trip)",
    "Escort Guide / English-speaking driver-guide",
  ];

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

  const isBaliOrigin = (serialized.originCity ?? "").toLowerCase() === "bali";
  const isBaliEnd = (serialized.endCity ?? "").toLowerCase() === "bali";

  const mapped: any =
    all === "true"
      ? serialized
      : {
          tripId: serialized.packageId,
          name: serialized.name,
          duration: {
            days: serialized.durationDays || 0,
            nights: serialized.durationNights || 0,
            iso8601: `P${serialized.durationDays || 0}D${serialized.durationNights || 0}N`,
          },
          start: {
            city: serialized.originCity || "",
            pickupOptions:
              isBaliOrigin
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
            city: serialized.endCity || "",
            dropoffOptions:
              isBaliEnd
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
              isBaliEnd
                ? `For flights from Ngurah Rai International Airport (DPS) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`
                : `For flights from Juanda International Airport (SUB) on the final day, we strongly recommend booking flights that depart after 20:00 (8:00 PM).`,
          },
          route,
          accommodationPlan: (serialized.accommodationPlan ?? []).map((h: any) => ({
            night: h.night || 0,
            area: h.area || "",
            hotel: h.name || "",
          })),
          gearProvided: hasIjen
            ? ["Gas mask (sanitized after each use)", "Trekking poles"]
            : [],
          gearRecommended: gearRecommended,
          itineraryDays: (serialized.itineraryDays ?? []).map((day: any) => {
            const mealsIncluded: string[] = [];
            if (day.mealsPlan?.breakfast === "included") mealsIncluded.push("Breakfast");
            if (day.mealsPlan?.lunch === "included") mealsIncluded.push("Lunch");
            if (day.mealsPlan?.dinner === "included") mealsIncluded.push("Dinner");

            return {
              day: day.day || 0,
              title: day.title || "",
              summary: day.summary || "",
              mealsIncluded,
              activities: (day.activities ?? []).map((act: any) => {
                if (act.type === "TravelAction") {
                  return {
                    type: act.type,
                    timeApprox: act.timeWindow || "",
                    fromLocation: { name: act.fromLocation || "" },
                    toLocation: { name: act.toLocation || "" },
                    description: act.description || "",
                  };
                }
                return {
                  type: act.type || "TouristAttractionVisit",
                  timeApprox: act.timeWindow || "",
                  location: { name: act.location || "" },
                  description: act.description || "",
                };
              }),
            };
          }),
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