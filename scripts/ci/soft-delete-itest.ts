/**
 * Soft-delete filtering integration test (production-release hardening, §3.3).
 *
 * Proves getWebPackageDetail() excludes soft-deleted rows on a REAL Postgres, not
 * just at the type level. Seeds one package with an ACTIVE and a SOFT-DELETED row
 * on every relation the fix touches, then asserts only the active side is visible
 * in the compiled TourPackageDetail. Also proves the whole package itself 404s
 * (returns null) when soft-deleted.
 *
 * Requires DATABASE_URL to point at a DISPOSABLE database with the schema pushed
 * (`prisma db push`). Never touches production/live. Run via:
 *   DATABASE_URL=postgresql://… npx tsx scripts/ci/soft-delete-itest.ts
 */
import { PrismaClient } from "@/generated/prisma";
import { getWebPackageDetail } from "../../src/lib/packages/getWebPackageDetail";

const prisma = new PrismaClient();

let failures = 0;
function ok(cond: boolean, msg: string) {
  if (cond) console.log(`  ok    ${msg}`);
  else {
    console.log(`  FAIL  ${msg}`);
    failures++;
  }
}

async function main() {
  const suffix = Date.now().toString(36);
  const slug = `soft-delete-itest-${suffix}`;

  const duration = await prisma.durations.create({ data: { name: "2D1N", day: 2, night: 1 } });
  const category = await prisma.package_categories.create({ data: { name: `cat-${suffix}` } });

  const activeDest = await prisma.destinations.create({ data: { name: `Active Destination ${suffix}` } });
  const deletedDest = await prisma.destinations.create({
    data: { name: `DELETED Destination ${suffix}`, deleted_at: new Date() },
  });

  const activeHotel = await prisma.hotels.create({ data: { name: `Active Hotel ${suffix}` } });
  const deletedHotel = await prisma.hotels.create({
    data: { name: `DELETED Hotel ${suffix}`, deleted_at: new Date() },
  });

  const activeTier = await prisma.price_tiers.create({ data: { name: "std", min_pax: 2, max_pax: 6 } });

  const activeItemInclude = await prisma.item_includes.create({ data: { item: `Active Include ${suffix}` } });
  const deletedItemInclude = await prisma.item_includes.create({
    data: { item: `DELETED Include ${suffix}`, deleted_at: new Date() },
  });
  const activeItemExclude = await prisma.item_excludes.create({ data: { item: `Active Exclude ${suffix}` } });
  const deletedItemExclude = await prisma.item_excludes.create({
    data: { item: `DELETED Exclude ${suffix}`, deleted_at: new Date() },
  });

  const activeAddon = await prisma.addons.create({ data: { name: `Active Addon ${suffix}` } });
  const deletedAddon = await prisma.addons.create({
    data: { name: `DELETED Addon ${suffix}`, deleted_at: new Date() },
  });

  const pkg = await prisma.packages.create({
    data: {
      name: `Soft Delete Itest ${suffix}`,
      slug,
      is_publish: true,
      duration_id: duration.id,
      package_category_id: category.id,
      start_destination_id: activeDest.id,
      end_destination_id: activeDest.id,
    },
  });

  // Prices: one active, one soft-deleted. Distinct prices so a leak is unambiguous.
  await prisma.package_prices.create({
    data: { package_id: pkg.id, price_tier_id: activeTier.id, price: 1_000_000 },
  });
  await prisma.package_prices.create({
    data: { package_id: pkg.id, price_tier_id: activeTier.id, price: 9_999_999, deleted_at: new Date() },
  });

  // package_destinations: active dest + soft-deleted dest, PLUS a soft-deleted
  // package_destinations row pointing at an otherwise-active destination (proves
  // the join row's own deleted_at is honored, not just the destination's).
  await prisma.package_destinations.create({ data: { package_id: pkg.id, destination_id: activeDest.id } });
  await prisma.package_destinations.create({ data: { package_id: pkg.id, destination_id: deletedDest.id } });
  const activeDest2 = await prisma.destinations.create({ data: { name: `Active Destination 2 ${suffix}` } });
  await prisma.package_destinations.create({
    data: { package_id: pkg.id, destination_id: activeDest2.id, deleted_at: new Date() },
  });

  await prisma.package_includes.create({ data: { package_id: pkg.id, item_include_id: activeItemInclude.id } });
  await prisma.package_includes.create({ data: { package_id: pkg.id, item_include_id: deletedItemInclude.id } });
  await prisma.package_excludes.create({ data: { package_id: pkg.id, item_exclude_id: activeItemExclude.id } });
  await prisma.package_excludes.create({ data: { package_id: pkg.id, item_exclude_id: deletedItemExclude.id } });

  await prisma.package_addons.create({ data: { package_id: pkg.id, addon_id: activeAddon.id } });
  await prisma.package_addons.create({ data: { package_id: pkg.id, addon_id: deletedAddon.id } });

  await prisma.package_hotel_options.create({ data: { package_id: pkg.id, day_no: 1, hotel_id: activeHotel.id } });
  await prisma.package_hotel_options.create({ data: { package_id: pkg.id, day_no: 2, hotel_id: deletedHotel.id } });

  // Itinerary: an active day and a fully soft-deleted day. Both reference a
  // route so the (unfiltered, deleted_at-less) route_details activities render.
  const route = await prisma.routes.create({
    data: {
      code: `RT-${suffix}`,
      route: "test route",
      itinerary_title: "Test Route",
      start_area: "A",
      end_area: "B",
    },
  });
  await prisma.route_details.create({ data: { route_id: route.id, seq: 1, activity: "Drive to A" } });

  await prisma.package_itinerary_days.create({
    data: { package_id: pkg.id, day_no: 1, title: "Active Day", route_id: route.id },
  });
  await prisma.package_itinerary_days.create({
    data: { package_id: pkg.id, day_no: 2, title: "DELETED Day", route_id: route.id, deleted_at: new Date() },
  });

  const result = await getWebPackageDetail(slug);
  if (!result) {
    console.log("  FAIL  getWebPackageDetail returned null for an active package — cannot run assertions");
    failures++;
  } else {
    const p = result.product;

    ok(p.offers.tiers.length === 1, `exactly 1 price tier visible (got ${p.offers.tiers.length})`);
    ok(
      p.offers.tiers.every((t) => t.pricePerPerson !== 9_999_999),
      "the soft-deleted price (9,999,999) is NOT in offers.tiers",
    );

    ok(
      p.route.includes(`Active Destination ${suffix}`),
      "active destination IS in route",
    );
    ok(
      !p.route.includes(`DELETED Destination ${suffix}`),
      "soft-deleted destination is NOT in route",
    );
    ok(
      !p.route.includes(`Active Destination 2 ${suffix}`),
      "a destination reached only via a soft-deleted package_destinations JOIN row is NOT in route (join-row deleted_at honored, not just the destination's)",
    );

    ok(p.inclusions.includes(`Active Include ${suffix}`), "active inclusion IS present");
    ok(!p.inclusions.includes(`DELETED Include ${suffix}`), "soft-deleted inclusion is NOT present");
    ok(p.exclusions.includes(`Active Exclude ${suffix}`), "active exclusion IS present");
    ok(!p.exclusions.includes(`DELETED Exclude ${suffix}`), "soft-deleted exclusion is NOT present");

    const addonNames = p.addOns.map((a: any) => a.name);
    ok(addonNames.includes(`Active Addon ${suffix}`), "active addon IS present");
    ok(!addonNames.includes(`DELETED Addon ${suffix}`), "soft-deleted addon is NOT present");

    const hotelNames = p.accommodationPlan.map((h: any) => h.name);
    ok(hotelNames.includes(`Active Hotel ${suffix}`), "active hotel option IS present");
    ok(!hotelNames.includes(`DELETED Hotel ${suffix}`), "soft-deleted hotel option is NOT present");

    const dayTitles = p.itineraryDays.map((d: any) => d.title);
    ok(dayTitles.includes("Active Day"), "active itinerary day IS present");
    ok(!dayTitles.includes("DELETED Day"), "soft-deleted itinerary day is NOT present");
  }

  // The package itself: soft-delete it and prove the whole lookup 404s (returns null).
  await prisma.packages.update({ where: { id: pkg.id }, data: { deleted_at: new Date() } });
  const afterDelete = await getWebPackageDetail(slug);
  ok(afterDelete === null, "soft-deleting the package itself makes getWebPackageDetail return null (404, not a partial/broken payload)");

  console.log(
    failures === 0
      ? "\n[soft-delete-itest] PASS"
      : `\n[soft-delete-itest] FAIL — ${failures} assertion(s) failed`,
  );
  await prisma.$disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
