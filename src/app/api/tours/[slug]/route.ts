import { activities } from "./../../../../generated/prisma/index.d";
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
        include: { hotels: true },
      },
      package_images: true,
      package_includes: { include: { item_includes: true } },
      package_itinerary_days: {
        orderBy: { day_no: "asc" },
        include: { package_itinerary_day_details: true },
      },
      package_prices: { include: { price_tiers: true } },
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

  const routePackage =
    serialized.package_destinations
      ?.filter((d: any) => d.destination_id != 3 && d.destination_id != 4)
      .map((d: any) => d.destinations?.name)
      .filter(Boolean)
      .join(" • ") || "";
  const keyExperiences =
    serialized.package_destinations
      ?.filter((d: any) => d.destination_id != 3 && d.destination_id != 4)
      .flatMap((d: any) => d.destinations?.activities || []) // ambil semua activity dari setiap destinasi
      .map((a: any) => a.activity_name) // ambil hanya nama aktivitasnya
      .filter(Boolean) || [];

  const mapped =
    all === "true"
      ? serialized // kalau ?all=true kirim data lengkap
      : {
          id: serialized.code,
          slug: serialized.slug,
          name: serialized.name,
          shortLabel: `${serialized.durations.day}D${serialized.durations.night}N ${routePackage}`,
          description: serialized.description,
          originCity: serialized.start_destination.name,
          endCity: serialized.start_destination.name,
          durationDays: serialized.durations.day,
          durationNights: serialized.durations.night,

          tripRef: {
            tripId: `trip-${serialized.code}`,
            href: `/jvto_master/trips/trip-${serialized.code}.json`,
          },

          keyExperiences: keyExperiences,

          physicality: serialized.physicality,

          inclusions: serialized.package_includes.map(
            (inc: any) => inc.item_includes?.item
          ),

          exclusions: serialized.package_excludes.map(
            (exc: any) => exc.item_excludes?.item
          ),

          addOns: serialized.package_addons.map((addon: any) => ({
            name: addon.addons?.name,
            description: addon.addons?.is_transport ? `Transport ${addon.addons.transport_type}` : "",
            price: addon.addons?.price,
          })),

          offers: {
            currency: "IDR",
            aggregateOffer: {
              lowPrice: "",
              highPrice: "",
              priceCurrency: "IDR",
            },
            tiers: [
              {
                sku: "",
                paxMin: "",
                paxMax: "",
                pricePerPerson: "",
                unit: "person",
              },
            ],
          },

          aggregateRating: {
            ratingValue: "",
            reviewCount: "",
            sourceExamples: [
              {
                text: "",
                author: "",
                source: "",
              },
            ],
          },

          travelerRequirements: [],

          marketing: {
            perfectFor: "",
            highlightsBullets: [],
            safetyPositioning: "",
          },

          provider: {
            name: "",
            legalEntity: "",
            headOffice: "",
            license: "",
          },
        };

  return Response.json(mapped);
}
