// src/lib/packages/getWebPackageDetail.ts
// Created 2026-04-29 to refactor self-fetch anti-pattern: tour detail pages were fetching their
// own /api/packages/web/details endpoint during SSG, which fails with ECONNREFUSED at build time
// (no API server running yet). This helper extracts the transform logic so:
//   - The API route still works for external clients (calls this helper, returns NextResponse).
//   - Server Components (tour detail pages) call this helper directly, skipping HTTP entirely.
// Backward-compatible: response shape identical to the previous API output.
import { prisma } from '@/lib/prisma';
import type { TourPackageDetail } from '@/interfaces';
import { MOCK_PACKAGE_DETAILS } from '@/data/mockData';

const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);

function ucwords(str: string) {
  if (!str) return '';
  str = str.toLowerCase();
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Strip BigInt by stringifying-then-parsing. Even though BigInt.prototype.toJSON is now
 * monkey-patched in lib/prisma.ts (returns string), this helper preserves backward compat
 * with the existing API output shape where numeric IDs come back as strings.
 */
function replaceBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
}

/**
 * Fetch a published web tour-package detail by slug. Returns null on miss.
 * Honors NEXT_PUBLIC_IS_FIREBASE mock-mode env flag (matches the prior route.ts behavior).
 */
export async function getWebPackageDetail(slug: string): Promise<TourPackageDetail | null> {
  if (!slug) return null;

  // Mock-data branch (preserved from route.ts) — used when running against MOCK_PACKAGE_DETAILS.
  if (process.env.NEXT_PUBLIC_IS_FIREBASE === 'true') {
    const mockPkg = (MOCK_PACKAGE_DETAILS as any[]).find(
      (p) => p.product?.slug === slug || p.slug === slug,
    );
    return (mockPkg as TourPackageDetail) ?? null;
  }

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
        orderBy: { sort_order: 'asc' },
      },
      package_prices: {
        include: { price_tiers: true },
        orderBy: { price: 'asc' },
      },
      package_includes: { include: { item_includes: true } },
      package_excludes: { include: { item_excludes: true } },
      package_addons: { include: { addons: true } },
      package_assets: { include: { asset: true } },
      package_faqs: true,
      package_hotel_options: {
        orderBy: { day_no: 'asc' },
        include: { hotels: { include: { destinations: true } } },
      },
      package_itinerary_days: {
        orderBy: { day_no: 'asc' },
        include: {
          package_itinerary_day_details: {
            orderBy: { sort_order: 'asc' },
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
                orderBy: { seq: 'asc' },
                include: {
                  locations_route_details_from_location_idTolocations: { select: { name: true } },
                  locations_route_details_to_location_idTolocations: { select: { name: true } },
                },
              },
              locations_routes_end_location_idTolocations: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!pkg) return null;

  const globalGears = await prisma.$queryRaw<
    Array<{
      id: bigint;
      destination_id: bigint | null;
      gear: string;
      type: string;
      created_at: Date | null;
      updated_at: Date | null;
    }>
  >`SELECT * FROM destination_gears WHERE destination_id IS NULL`;

  const allTiers = (pkg.package_prices ?? [])
    .map((p) => p.price_tiers)
    .filter((t) => t != null);

  const calculatedMinPax =
    allTiers.length > 0 ? Math.min(...allTiers.map((t) => t?.min_pax ?? 1)) : 1;
  const calculatedMaxPax = 100;

  const detail = {
    id: Number(pkg.id),
    packageId: pkg.code,
    type: 'package',
    version: '1.0.0',
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
      seoTitle: pkg.seo_title ?? '',
      seoDescription: pkg.seo_meta ?? '',
      shortLabel: pkg.short_label,
      originCity: pkg.start_destination?.name ?? '',
      endCity: pkg.end_destination?.name ?? '',
      category_id:
        Number(pkg.package_category_id ?? 0) === 1 ? 'reluger' : 'student',
      category: pkg.package_categories?.name ?? '',
      durationId: pkg.durations?.id ?? null,
      durationDays: pkg.durations?.day ?? 0,
      durationNights: pkg.durations?.night ?? 0,
      marketedDurationLabel: `${pkg.durations?.day ?? 0}D${
        pkg.durations?.night ?? 0
      }N`,
      route: (pkg.package_destinations ?? [])
        .filter(
          (pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id)),
        )
        .map((dest) => dest.destinations?.name ?? ''),
      tripRef: `/trips/trip-${pkg.code}.json`,
      description: pkg.description ?? '',
      keyExperiences: (pkg.package_destinations ?? [])
        .filter(
          (pd) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id)),
        )
        .map((dest) => ({
          name: dest.destinations?.name ?? '',
          highlight: dest.destinations?.highlight ?? '',
        })),
      physicalDifficulty: pkg.physicality ?? '',
      offers: {
        currency: 'IDR',
        aggregateOffer: {
          lowPrice:
            Math.min(
              ...(pkg.package_prices ?? [])
                .map((p) => p.price)
                .filter((v): v is number => typeof v === 'number'),
            ) || 0,
          highPrice:
            Math.max(
              ...(pkg.package_prices ?? [])
                .map((p) => p.price)
                .filter((v): v is number => typeof v === 'number'),
            ) || 0,
        },
        tiers: (pkg.package_prices ?? []).map((price, key) => ({
          sku: pkg.code + '-' + (key + 1),
          paxMin: price.price_tiers?.min_pax ?? 0,
          paxMax: price.price_tiers?.max_pax ?? 0,
          pricePerPerson: price.price ?? 0,
        })),
      },
      inclusions: (pkg.package_includes ?? []).map(
        (inc) => inc.item_includes?.item ?? '',
      ),
      exclusions: (pkg.package_excludes ?? []).map(
        (exc) => exc.item_excludes?.item ?? '',
      ),
      travelerRequirements: Array.isArray(pkg.traveler_requirements)
        ? pkg.traveler_requirements
            .map((s) => s?.trim())
            .filter((s) => s && s.length > 0)
        : [],
      addOns: (pkg.package_addons ?? []).map((addon: any) => ({
        id: addon.addons?.id,
        name: addon.addons?.is_transport
          ? `Transport to ${ucwords(addon.addons?.name || '')}`
          : addon.addons?.name || '',
        type:
          addon.addons?.id == 2
            ? 'madakaripura'
            : addon.addons?.is_transport
            ? 'transport'
            : null,
        description: addon.addons?.is_transport
          ? `Transport to ${ucwords(addon.addons?.name || '')} - ${ucwords(
              addon.addons?.transport_type || '',
            )} Car (${
              addon.addons?.transport_type === 'small'
                ? '1-3 Pax'
                : addon.addons?.transport_type === 'medium'
                ? '4-9 Pax'
                : '10 Pax Above'
            })`
          : '',
        transportType: addon.addons?.transport_type ?? null,
        transportDestination: addon.addons?.name ?? null,
        price: addon.addons?.price ?? 0,
      })),
      accommodationPlan:
        (pkg.package_hotel_options ?? []).map((h: any) => ({
          night: h.day_no ?? 0,
          name: h.hotels?.name ?? '',
          area: h.hotels?.destinations?.name ?? '',
          image: h.hotels
            ? 'https://legacy.javavolcano-touroperator.com/assets/img/hotels/' +
              h.hotels.banner
            : '',
        })) ?? [],
      gear: {
        provided: [
          ...(globalGears ?? [])
            .filter((g) => g.type === 'provided')
            .map((g) => g.gear),
          ...(pkg.package_destinations ?? [])
            .flatMap((pd) => pd.destinations?.destination_gears ?? [])
            .filter((g) => g.type === 'provided')
            .map((g) => g.gear),
        ],
        recommended: [
          ...(globalGears ?? [])
            .filter((g) => g.type === 'recommended')
            .map((g) => g.gear),
          ...(pkg.package_destinations ?? [])
            .flatMap((pd) => pd.destinations?.destination_gears ?? [])
            .filter((g) => g.type === 'recommended')
            .map((g) => g.gear),
        ],
      },
      itineraryDays:
        (pkg.package_itinerary_days ?? []).map((day: any) => ({
          day: day.day_no ?? 0,
          title: day.title ?? '',
          summary: day.activity ?? '',
          activities:
            day.routes?.route_details?.map((act: any) => {
              const type = act.type;
              const fromName = act.locations_route_details_from_location_idTolocations?.name ?? '';
              const toName = act.locations_route_details_to_location_idTolocations?.name ?? '';
              if (type === 'TravelAction') {
                return {
                  type,
                  name: act.name,
                  description: act.activity,
                  fromLocation: fromName,
                  toLocation: toName,
                  timeWindow: act.time_or_label,
                  durationMinutes: act.duration_minutes,
                };
              }
              return {
                type,
                name: act.name,
                description: act.activity,
                location: fromName,
                timeWindow: act.time_or_label,
                durationMinutes: act.duration_minutes,
              };
            }) ?? [],
          mealsPlan: {
            breakfast: day.meal_breakfast ? 'included' : 'own expense',
            lunch: day.meal_lunch ? 'included' : 'own expense',
            dinner: day.meal_dinner ? 'included' : 'own expense',
          },
          mealsNotes: day.routes?.meals_notes ?? '',
          overnight: day.hotel_id ? day.routes?.locations_routes_end_location_idTolocations?.name ?? null : null,
        })) ?? [],
      gallery: (pkg.package_assets ?? [])
        .filter((pa: any) => pa.asset?.type === 'image')
        .map((pa: any) => pa.asset?.url ?? ''),
      imageUrl:
        (pkg.package_assets ?? []).filter(
          (pa: any) => pa.asset?.type === 'image' && pa.is_primary,
        )[0]?.asset?.url ?? '',
      tags: Array.isArray(pkg.tags)
        ? pkg.tags.map((s) => s?.trim()).filter((s) => s && s.length > 0)
        : [],
      aggregateRating: { ratingValue: 0, reviewCount: 0 },
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
        safetyPositioning: pkg.safety_positioning ?? '',
        uniqueSellingPoints: Array.isArray(pkg.unique_selling_points)
          ? pkg.unique_selling_points
              .map((s) => s?.trim())
              .filter((s) => s && s.length > 0)
          : [],
      },
      operationalComplexityNote: pkg.operational_complexity_note ?? '',
      provider: {
        brand: 'Java Volcano Tour Operator (JVTO)',
        legalEntity: 'PT Java Volcano Rendezvous',
        nib: '1102230032918',
        tdup: '1102230032918',
        official: {
          website: 'https://javavolcano-touroperator.com',
          whatsapp: '+62 822-4478-8833',
          email: 'hello@javavolcano-touroperator.com',
        },
        policyRef: {
          booking: '/policy/booking.json',
          inclusions: '/policy/inclusions_exclusions.json',
        },
        policyVersion: '2025-11-09',
      },
      compliance: {
        destinationsWhitelist: true,
        itineraryTablesGenerated: true,
        healthScreeningIncluded: (pkg.package_destinations ?? []).some(
          (pd) => Number(pd.destination_id) === 2,
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
        externalPackageIds: { klook: '', traveloka: '', tiketcom: '' },
        isFreesale: true,
        requiresAvailabilityCheck: false,
        supportedPickupCities: pkg.start_destination?.name
          ? [pkg.start_destination.name]
          : [],
        supportedDropoffCities: pkg.end_destination?.name
          ? [pkg.end_destination.name]
          : [],
        languageOffered: ['en'],
        status: 'active',
        minLeadTimeHours: 24,
        maxPaxRecommended: calculatedMaxPax,
        minPaxOperational: calculatedMinPax,
      },
      _cms: {
        contentType: 'tour-package',
        version: '2.0',
        created: '2025-01-15T00:00:00Z',
        lastModified: '2025-01-15T00:00:00Z',
        status: 'published',
        owner: 'content-team',
        i18nReady: true,
        seoOptimized: true,
        schemaType: 'TouristTrip',
      },
    },
    trip: {
      vehiclePlan: {
        primary: [
          {
            type: 'MPV',
            model: 'Toyota Avanza/Innova',
            banner:
              'https://legacy.javavolcano-touroperator.com/assets/img/cars/avanza.png',
            maxPax: 3,
            baggageCapacity: '3 medium bags',
            features: ['AC', 'Charging ports'],
          },
          {
            type: 'Hiace',
            model: 'Toyota Hiace',
            banner:
              'https://legacy.javavolcano-touroperator.com/assets/img/cars/hiace.png',
            maxPax: 11,
            baggageCapacity: '11 medium bags',
            features: ['AC', 'Spacious legroom'],
          },
        ],
        jeepRequiredAt: ['mount-bromo'],
        jeepSpecs: {
          type: '4WD Jeep',
          capacity: '4-6 pax',
          inclusions: [
            'Experienced driver',
            'Kingkong Hill access',
            'Vintage Jeep experience',
          ],
        },
      },
    },
  };

  // Double cast required: the inline literal carries Prisma's exact column types (id: number,
  // slug: string|null) but TourPackageDetail expects looser shapes (slug: string, etc).
  // replaceBigInt JSON-roundtrips so runtime shape is plain JSON, structurally compatible.
  return replaceBigInt(detail) as unknown as TourPackageDetail;
}
