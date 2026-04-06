import type { TourPackageDetail } from "@/interfaces";

type PackageProduct = TourPackageDetail["product"];

export type PackageDoctrineCard = {
  title: string;
  copy: string;
};

export type PackageDoctrineMetric = {
  label: string;
  value: string;
};

export type PackageDoctrineBlock<TItem> = {
  title: string;
  copy: string;
  items: TItem[];
};

export type PackageDoctrine = {
  routeFit: PackageDoctrineBlock<PackageDoctrineCard>;
  routeRhythm: PackageDoctrineBlock<PackageDoctrineMetric>;
  startEndLogic: PackageDoctrineBlock<PackageDoctrineCard>;
  paymentSummary: PackageDoctrineBlock<PackageDoctrineCard>;
  routeReality: PackageDoctrineBlock<PackageDoctrineCard>;
  hotelRooming: PackageDoctrineBlock<PackageDoctrineCard>;
  mealsReality: PackageDoctrineBlock<PackageDoctrineCard>;
  closestAlternative: PackageDoctrineBlock<{
    title: string;
    copy: string;
    href: string;
  }>;
};

function includesToken(items: string[] | undefined, matcher: RegExp) {
  return (items ?? []).some((item) => matcher.test(item.toLowerCase()));
}

function getRouteStops(pkg: PackageProduct) {
  return (pkg.route ?? []).filter((item): item is string => Boolean(item?.trim()));
}

function getLongestMovementNote(pkg: PackageProduct) {
  const heaviestDay = [...(pkg.itineraryDays ?? [])]
    .map((day) => ({
      day: day.day,
      totalMinutes: (day.activities ?? []).reduce(
        (sum, item) => sum + (typeof item.durationMinutes === "number" ? item.durationMinutes : 0),
        0,
      ),
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)[0];

  if (heaviestDay && heaviestDay.totalMinutes >= 180) {
    return `Day ${heaviestDay.day} carries the heaviest timed movement in the route, so it should be treated as the main stamina and transfer day.`;
  }

  if ((pkg.durationDays ?? 0) <= 1) {
    return "The route is short on the calendar, but the movement is compressed into one efficiency-led window with very little slack.";
  }

  return "The biggest movement load sits in the transfer-and-positioning part of the route, not only in the scenic stop itself.";
}

function getWakeUpReality(pkg: PackageProduct, includesIjen: boolean, includesBromo: boolean) {
  if (includesIjen) {
    return "The hardest wake-up window sits around the Ijen climb, so health screening and night readiness are part of the route logic, not an add-on.";
  }

  if (includesBromo) {
    return "Bromo sunrise timing creates the earliest pressure point, which is why cold-weather prep and jeep staging matter before the route begins.";
  }

  if ((pkg.durationDays ?? 0) <= 1) {
    return "This package behaves more like a timed overnight operation than a soft day tour, so sleep disruption should be treated as part of the product.";
  }

  return "The route stays private and structured, but the demanding hours still sit in the early-movement segments rather than the quieter hotel windows.";
}

function getRecoveryPattern(pkg: PackageProduct) {
  const overnights = Math.max(
    pkg.durationNights ?? 0,
    Array.isArray(pkg.accommodationPlan) ? pkg.accommodationPlan.length : 0,
  );

  if (overnights === 0) {
    return "There is no real hotel-reset rhythm here. The route works when guests value timing efficiency more than recovery space.";
  }

  if (overnights === 1) {
    return "There is one overnight staging window, so the package is still compact. The hotel night supports the route; it does not turn the pace into a resort flow.";
  }

  return `${overnights} overnight stages give the route more reset points, but the sequence is still driven by transfers, terrain, and the order of the stops.`;
}

function getBestMindset(pkg: PackageProduct, includesIjen: boolean, includesWaterfall: boolean) {
  if ((pkg.durationDays ?? 0) >= 4) {
    return "Treat this as a managed East Java journey. It is stronger when guests want progression and contrast, not just a short highlight reel.";
  }

  if (includesIjen && includesWaterfall) {
    return "Choose this route when you want a serious mountain-plus-waterfall sequence and can accept that one strong route day will carry both fatigue and variety.";
  }

  if (includesIjen) {
    return "Choose this route when Ijen is the real objective and you want the page to stay honest about readiness, not just the headline stop.";
  }

  return "Choose this route for private handling and route clarity, not because it will automatically feel slow or effortless.";
}

function getLessIdealCopy(pkg: PackageProduct, includesIjen: boolean, includesWaterfall: boolean) {
  if ((pkg.durationDays ?? 0) <= 1) {
    return "Less ideal for guests expecting normal sleep timing, hotel-based recovery, or a relaxed sightseeing pace.";
  }

  if (includesIjen) {
    return "Less ideal for guests who do not want screening, night-ascent timing, or route decisions affected by crater access and conditions.";
  }

  if (includesWaterfall) {
    return "Less ideal for guests who want dry, low-effort terrain or who do not want stairs, wet footing, and route contrast to affect comfort.";
  }

  return "Less ideal for guests who want the lightest possible route rather than a private program with defined timing and support logic.";
}

function getWhyThisRouteExists(pkg: PackageProduct, routeStops: string[]) {
  return (
    pkg.marketing?.uniqueSellingPoints?.[0] ??
    pkg.marketing?.highlightsBullets?.[0] ??
    `This package exists to keep ${routeStops.join(", ")} inside one private route that stays readable before payment, not only after checkout.`
  );
}

function getRouteShapeLabel(pkg: PackageProduct, includesIjen: boolean, includesWaterfall: boolean) {
  if ((pkg.durationDays ?? 0) <= 1) return "Overnight efficiency route";
  if (includesIjen && (pkg.durationDays ?? 0) <= 2) return "Focused Ijen expedition";
  if ((pkg.durationDays ?? 0) >= 4) return "East Java overland sequence";
  if (includesIjen && includesWaterfall) return "Compact contrast loop";
  return "Private volcano route";
}

function getPathKey(pkg: PackageProduct, pathname?: string) {
  if (pathname?.startsWith("/tours/")) return pathname;
  if (typeof pkg.slug === "string" && pkg.slug.startsWith("tours/")) return `/${pkg.slug}`;
  return undefined;
}

function getClosestAlternative(pathKey: string | undefined, pkg: PackageProduct) {
  const origin =
    pkg.originCity?.toLowerCase().includes("bali") ? "/tours/from-bali" : "/tours/from-surabaya";

  const fallback = [
    {
      title: "Compare The Full Catalog",
      copy: "If the route logic is close but not exact, open the origin hub and compare the nearby family before you move to payment.",
      href: origin,
    },
  ];

  if (!pathKey) return fallback;

  const map: Record<string, { title: string; copy: string; href: string }[]> = {
    "/tours/from-surabaya/bromo-1d1n": [
      {
        title: "2D1N Bromo With More Breathing Room",
        copy: "Use this if you want Bromo handled with one overnight instead of an overnight-efficiency rhythm.",
        href: "/tours/from-surabaya/bromo-2d1n",
      },
    ],
    "/tours/from-surabaya/bromo-2d1n": [
      {
        title: "1D1N Bromo For Pure Efficiency",
        copy: "Use this if the main constraint is time and you can accept a much tighter sleep and transfer pattern.",
        href: "/tours/from-surabaya/bromo-1d1n",
      },
    ],
    "/tours/from-surabaya/ijen-2d1n": [
      {
        title: "3D2N Ijen, Bromo, Madakaripura",
        copy: "Use this if you want a fuller East Java loop instead of a focused Ijen expedition.",
        href: "/tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
      },
    ],
    "/tours/from-surabaya/bromo-madakaripura-ijen-3d2n": [
      {
        title: "3D2N Ijen, Bromo, Madakaripura",
        copy: "Compare the reversed route order if the timing pressure and where the hardest segment lands matter to your group.",
        href: "/tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
      },
    ],
    "/tours/from-surabaya/ijen-bromo-madakaripura-3d2n": [
      {
        title: "3D2N Bromo, Madakaripura, Ijen",
        copy: "Compare the alternative route order if you want the Bromo side to sit earlier in the trip rather than later.",
        href: "/tours/from-surabaya/bromo-madakaripura-ijen-3d2n",
      },
      {
        title: "4D3N Ijen, Bromo, Madakaripura",
        copy: "Move up one level if you want the same core sequence with more room around the route.",
        href: "/tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
      },
    ],
    "/tours/from-surabaya/ijen-bromo-madakaripura-4d3n": [
      {
        title: "3D2N Ijen, Bromo, Madakaripura",
        copy: "Use this if you want the same core loop in a more compact flagship form.",
        href: "/tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
      },
    ],
    "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n": [
      {
        title: "5D4N Ijen, Papuma, Tumpak Sewu, Bromo",
        copy: "Choose this if you want the same family with more breadth and less compression.",
        href: "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
      },
    ],
    "/tours/from-surabaya/tumpak-sewu-bromo-ijen-4d3n": [
      {
        title: "4D3N Ijen, Papuma, Tumpak Sewu, Bromo",
        copy: "Compare this if you want a different route order and a beach stop in the same overland family.",
        href: "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n",
      },
    ],
    "/tours/from-surabaya/ijen-bromo-madakaripura-malang-5d4n": [
      {
        title: "5D4N Ijen, Papuma, Tumpak Sewu, Bromo",
        copy: "Compare this if you want broader nature contrast instead of adding the Malang city recovery layer.",
        href: "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
      },
    ],
    "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n": [
      {
        title: "6D5N Ijen, Papuma, Tumpak Sewu, Bromo, Malang",
        copy: "Move up if you want more recovery space and a softer final-stage landing around Malang.",
        href: "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-malang-6d5n",
      },
    ],
    "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-malang-6d5n": [
      {
        title: "5D4N Ijen, Papuma, Tumpak Sewu, Bromo",
        copy: "Use this if you want the same nature family with less total calendar length.",
        href: "/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
      },
    ],
    "/tours/from-surabaya/taman-safari-prigen-bromo-madakaripura-3d2n": [
      {
        title: "2D1N Bromo Sunrise Adventure",
        copy: "Compare this if the group wants a simpler mountain-and-waterfall route without the family-safari layer.",
        href: "/tours/from-surabaya/bromo-2d1n",
      },
    ],
    "/tours/from-bali/bromo-ijen-3d2n": [
      {
        title: "3D2N Ijen, Bromo, Madakaripura From Bali",
        copy: "Compare this if a forward finish into Surabaya matters more than a Bali return loop.",
        href: "/tours/from-bali/ijen-bromo-madakaripura-3d2n",
      },
    ],
    "/tours/from-bali/ijen-bromo-madakaripura-3d2n": [
      {
        title: "3D2N Bromo, Ijen Round-Trip Bali",
        copy: "Use this if returning to Bali is more valuable than finishing forward into Surabaya.",
        href: "/tours/from-bali/bromo-ijen-3d2n",
      },
    ],
    "/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n": [
      {
        title: "5D4N Ijen, Papuma, Tumpak Sewu, Bromo From Bali",
        copy: "Move up if you want the same family with more room around the long overland progression.",
        href: "/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-5d4n",
      },
    ],
    "/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-5d4n": [
      {
        title: "4D3N Ijen, Papuma, Tumpak Sewu, Bromo From Bali",
        copy: "Use this if you want to keep the same family but compress the total calendar length.",
        href: "/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n",
      },
    ],
  };

  return map[pathKey] ?? fallback;
}

export function buildPackageDoctrine(pkg: PackageProduct, pathname?: string): PackageDoctrine {
  const routeStops = getRouteStops(pkg);
  const includesIjen = includesToken(routeStops, /ijen/);
  const includesBromo = includesToken(routeStops, /bromo|sunrise/);
  const includesWaterfall = includesToken(routeStops, /waterfall|tumpak|madakaripura/);
  const includesPapuma = includesToken(routeStops, /papuma/);
  const includesFamilySafari = includesToken(routeStops, /safari/);
  const isLoop =
    Boolean(pkg.originCity && pkg.endCity) &&
    pkg.originCity.toLowerCase().trim() === pkg.endCity.toLowerCase().trim();
  const pathKey = getPathKey(pkg, pathname);
  const overnightAreas = (pkg.accommodationPlan ?? [])
    .map((item) => item.area?.trim())
    .filter((item): item is string => Boolean(item));
  const uniqueOvernightAreas = [...new Set(overnightAreas)];
  const mealCounts = (pkg.itineraryDays ?? []).reduce(
    (acc, day) => {
      if (day.mealsPlan?.breakfast === "included") acc.breakfast += 1;
      if (day.mealsPlan?.lunch === "included") acc.lunch += 1;
      if (day.mealsPlan?.dinner === "included") acc.dinner += 1;
      return acc;
    },
    { breakfast: 0, lunch: 0, dinner: 0 },
  );

  const routeFit: PackageDoctrineBlock<PackageDoctrineCard> = {
    title: "Route Fit And Timing Logic",
    copy:
      "This is the first commercial filter. It should tell the guest what kind of route this really is, who it suits best, and where the timing pressure actually sits.",
    items: [
      {
        title: "Best For",
        copy:
          pkg.marketing?.perfectFor?.[0] ??
          `Best for guests who want ${getRouteShapeLabel(pkg, includesIjen, includesWaterfall).toLowerCase()} from ${pkg.originCity} without losing operator clarity before payment.`,
      },
      {
        title: "Less Ideal For",
        copy: getLessIdealCopy(pkg, includesIjen, includesWaterfall),
      },
      {
        title: "Why This Route Exists",
        copy: getWhyThisRouteExists(pkg, routeStops),
      },
    ],
  };

  const routeRhythm: PackageDoctrineBlock<PackageDoctrineMetric> = {
    title: "What The Route Rhythm Feels Like",
    copy:
      "Calendar length alone is not enough. These notes explain where the route becomes demanding, where recovery happens, and what mindset fits the itinerary.",
    items: [
      {
        label: "Wake-Up Reality",
        value: getWakeUpReality(pkg, includesIjen, includesBromo),
      },
      {
        label: "Heaviest Movement",
        value: getLongestMovementNote(pkg),
      },
      {
        label: "Recovery Pattern",
        value: getRecoveryPattern(pkg),
      },
      {
        label: "Best Mindset",
        value: getBestMindset(pkg, includesIjen, includesWaterfall),
      },
    ],
  };

  const startEndLogic: PackageDoctrineBlock<PackageDoctrineCard> = {
    title: "Start, Finish, And Handoff Logic",
    copy:
      "Start city, finish city, and route order are not cosmetic. They change flight planning, fatigue pattern, and whether the package behaves like a loop or a forward handoff.",
    items: [
      {
        title: "Start Point",
        copy: `This package starts from ${pkg.originCity}. Pickup and first-transfer handling are part of the package logic, not a separate transport purchase.`,
      },
      {
        title: "Finish Logic",
        copy: isLoop
          ? `This route returns to ${pkg.endCity}, so it behaves like a closed loop rather than a forward handoff.`
          : `This route finishes in ${pkg.endCity}, so it works as a forward handoff and should be judged against onward travel plans, not return-loop expectations.`,
      },
      {
        title: "Route Order",
        copy:
          routeStops.length > 0
            ? `The route order follows ${routeStops.join(" -> ")}. That order shapes fatigue, hotel staging, and when the demanding segment actually happens.`
            : "The route order should be read as part of the package itself, because stop order changes the practical feel of the trip.",
      },
      {
        title: "Overnight Pattern",
        copy: getRecoveryPattern(pkg),
      },
    ],
  };

  const paymentSummary: PackageDoctrineBlock<PackageDoctrineCard> = {
    title: "Booking And Confirmation Snapshot",
    copy:
      "The package stays package-first: choose the route, understand the payment logic, then wait for the written confirmation that turns the booking into final authority.",
    items: [
      {
        title: "Availability Gate",
        copy: pkg.channelMetadata?.requiresAvailabilityCheck
          ? `Availability still needs confirmation, and the minimum operational starting point is ${pkg.channelMetadata.minPaxOperational} guest${pkg.channelMetadata.minPaxOperational > 1 ? "s" : ""}.`
          : `The package still depends on the written booking flow, even when route availability is shown clearly on the page.`,
      },
      {
        title: "Deposit Logic",
        copy:
          "The current checkout logic uses a standard 20% down payment, but within H-7 the route can move to full payment at checkout.",
      },
      {
        title: "Add-Ons And Totals",
        copy:
          "Optional add-ons are separated from the base package and are attached before checkout is finalized, so guests can see what belongs to the route and what is extra.",
      },
      {
        title: "Final Written Authority",
        copy:
          "The Official E-Voucher / Invoice and linked policy pages remain the final written authority for what is confirmed, included, and due.",
      },
    ],
  };

  const routeRealityItems: PackageDoctrineCard[] = [];

  if (includesIjen) {
    routeRealityItems.push(
      {
        title: "Ijen Screening Comes Before The Climb",
        copy:
          "Ijen routes should be treated as screening-led. Health clearance, night timing, and crater access are part of the route logic before payment.",
      },
      {
        title: "Blue Fire And Access Stay Conditional",
        copy:
          "Blue-fire visibility and crater access depend on live conditions. They should be framed as conditional route context, not as an unconditional promise.",
      },
    );
  }

  if (includesBromo) {
    routeRealityItems.push({
      title: "Bromo Means Pre-Dawn Cold And Jeep Handling",
      copy:
        "When Bromo is in the route, the guest should expect cold sunrise timing, jeep staging, and early-hour movement to shape comfort and pacing.",
    });
  }

  if (includesWaterfall) {
    routeRealityItems.push({
      title: "Waterfall Segments Change Footing And Fatigue",
      copy:
        "Waterfall stops are not decorative contrast. They affect shoes, wet-footing risk, stairs, and total energy load across the route day.",
    });
  }

  if (routeRealityItems.length === 0 && pkg.environmentalRisks?.[0]) {
    routeRealityItems.push({
      title: "Field Conditions Still Change The Decision",
      copy: pkg.environmentalRisks[0],
    });
  }

  const hotelRooming: PackageDoctrineBlock<PackageDoctrineCard> = {
    title: "Hotel Certainty And Rooming Logic",
    copy:
      "This block exists to stop repetitive accommodation questions before they start. It should explain zone, rooming pattern, and what is only finalized in the written voucher.",
    items: [
      {
        title: "Hotel Zone",
        copy:
          uniqueOvernightAreas.length > 0
            ? `This route stages overnights around ${uniqueOvernightAreas.join(", ")}. The zone is the public promise; exact property assignment stays subject to the written booking confirmation.`
            : "This package is not defined by hotel staging. Its value comes from route timing and handling rather than from a hotel reset rhythm.",
      },
      {
        title: "Rooming By Pax",
        copy:
          "Even-number groups normally receive one room for every two guests. Odd-number groups normally receive an extra bed in one room unless a separate-room supplement is written into the booking.",
      },
      {
        title: "Certainty Level",
        copy:
          "Publicly, the page should promise hotel zone and comfort logic first. Exact brand becomes final only when it appears on the Official E-Voucher / Invoice.",
      },
    ],
  };

  let routeSpecificMeals = `Across ${pkg.marketedDurationLabel}, breakfast is included ${mealCounts.breakfast} time${mealCounts.breakfast === 1 ? "" : "s"}, lunch ${mealCounts.lunch} time${mealCounts.lunch === 1 ? "" : "s"}, and dinner ${mealCounts.dinner} time${mealCounts.dinner === 1 ? "" : "s"}.`;

  if (includesIjen) {
    routeSpecificMeals =
      "Ijen routes need the guest to understand the staging around dinner, pre-climb timing, and post-ascent refuel rather than assume a generic full-board pattern.";
  } else if (includesPapuma || includesWaterfall) {
    routeSpecificMeals =
      "Beach and waterfall segments often change where and when meals happen, so route-day food support should be read from the itinerary rather than assumed from trip length.";
  } else if ((pkg.durationDays ?? 0) <= 1) {
    routeSpecificMeals =
      "Short overnight-efficiency routes should not be treated like normal multi-meal touring days. Guests should expect the page to state exactly what food support is included.";
  } else if (includesFamilySafari) {
    routeSpecificMeals =
      "Family routes should make meal timing feel predictable and readable, especially when safari-area stops and waterfall movement affect where lunch actually happens.";
  }

  const mealsReality: PackageDoctrineBlock<PackageDoctrineCard> = {
    title: "Meals Reality",
    copy:
      "Meals should be expressed as route support, not as an assumption. This section reduces false expectations before payment.",
    items: [
      {
        title: "Safe Baseline",
        copy:
          "The safest baseline is bottled water plus hotel breakfast for each overnight. Anything beyond that should be treated as route-specific, not automatic.",
      },
      {
        title: "Route-Specific Pattern",
        copy: routeSpecificMeals,
      },
      {
        title: "What Not To Assume",
        copy:
          "Do not assume every route includes all lunches and dinners. If a meal matters to your decision, it should be verified from the itinerary and the written booking confirmation.",
      },
    ],
  };

  const closestAlternativeItems = getClosestAlternative(pathKey, pkg);

  return {
    routeFit,
    routeRhythm,
    startEndLogic,
    paymentSummary,
    routeReality: {
      title: "Route Conditions That Matter Before Payment",
      copy:
        "These are decision filters, not background notes. They explain which live conditions or route-specific realities can materially affect whether the package still fits.",
      items: routeRealityItems,
    },
    hotelRooming,
    mealsReality,
    closestAlternative: {
      title: "Compare The Closest Route Shape",
      copy:
        "Use this only when the current package is close but not quite right. The point is to reduce tab-sprawl and help the guest compare the nearest family alternative directly.",
      items: closestAlternativeItems,
    },
  };
}
