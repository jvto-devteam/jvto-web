import type { ListTourPackage } from "@/types";

export type TourFamilyId =
  | "ultra-efficient-bromo"
  | "short-bromo-overnight"
  | "focused-ijen"
  | "flagship-3-day"
  | "east-java-overland"
  | "family-route";

export type TourFamilyMeta = {
  id: TourFamilyId;
  label: string;
  summary: string;
  compareNote: string;
  routeOrder: string;
  finishLogic: string;
  priority: number;
};

function getSlug(tour: ListTourPackage) {
  return tour.slug.toLowerCase();
}

function includesAll(source: string, values: string[]) {
  return values.every((value) => source.includes(value));
}

export function getTourRouteOrderLabel(tour: ListTourPackage) {
  const slug = getSlug(tour);

  if (includesAll(slug, ["bromo", "ijen"]) && slug.indexOf("bromo") < slug.indexOf("ijen")) {
    return "Bromo-first";
  }

  if (includesAll(slug, ["bromo", "ijen"]) && slug.indexOf("ijen") < slug.indexOf("bromo")) {
    return "Ijen-first";
  }

  if (slug.includes("tumpak-sewu")) {
    return "Contrast-led";
  }

  if (slug.includes("taman-safari")) {
    return "Family-paced";
  }

  if (slug.includes("ijen")) {
    return "Ijen-led";
  }

  if (slug.includes("bromo")) {
    return "Bromo-led";
  }

  return "Route-led";
}

export function getTourFinishLogicLabel(tour: ListTourPackage) {
  const start = tour.startDestination?.trim();
  const end = tour.endDestination?.trim();

  if (start && end && start.toLowerCase() !== end.toLowerCase()) {
    return "Forward handoff";
  }

  return "Round trip";
}

export function getTourFamilyMeta(tour: ListTourPackage): TourFamilyMeta {
  const slug = getSlug(tour);
  const routeOrder = getTourRouteOrderLabel(tour);
  const finishLogic = getTourFinishLogicLabel(tour);

  if (slug.includes("bromo-1d1n")) {
    return {
      id: "ultra-efficient-bromo",
      label: "Ultra-Efficient Bromo",
      summary:
        "Built for guests with very little time. Midnight movement and sunrise timing are part of the product, not a side effect.",
      compareNote:
        "Compare this against overnight Bromo only when breathing room matters more than pure timing efficiency.",
      routeOrder,
      finishLogic,
      priority: 1,
    };
  }

  if (slug.includes("bromo-2d1n")) {
    return {
      id: "short-bromo-overnight",
      label: "Short Bromo Overnight",
      summary:
        "Best when guests still want Bromo to feel complete, with one overnight and clearer mountain pacing than the 1-day route.",
      compareNote:
        "Compare this against the 1-day Bromo option when sleep rhythm and recovery matter to the decision.",
      routeOrder,
      finishLogic,
      priority: 2,
    };
  }

  if (slug.includes("ijen-2d1n")) {
    return {
      id: "focused-ijen",
      label: "Focused Ijen",
      summary:
        "A serious Ijen route where screening, night timing, and crater-readiness remain the core logic of the product.",
      compareNote:
        "Compare this against the 3-day families when guests want broader East Java contrast instead of one focused objective.",
      routeOrder,
      finishLogic,
      priority: 3,
    };
  }

  if (slug.includes("taman-safari")) {
    return {
      id: "family-route",
      label: "Family / Multi-Generational",
      summary:
        "A lower-anxiety route family built around broader age-fit, wildlife contrast, and easier pacing than the harder volcano-first packages.",
      compareNote:
        "Compare this against the regular 3-day volcano routes when the group needs easier physical rhythm or more multi-generational fit.",
      routeOrder,
      finishLogic,
      priority: 6,
    };
  }

  if (tour.duration.day >= 4) {
    return {
      id: "east-java-overland",
      label: "East Java Overland",
      summary:
        "A broader journey family where route progression, transfer handling, and contrast between volcanoes, waterfalls, and beach/city layers matter more than a single headline stop.",
      compareNote:
        "Compare these routes by added contrast, finish logic, and recovery space rather than by stop count alone.",
      routeOrder,
      finishLogic,
      priority: 5,
    };
  }

  return {
    id: "flagship-3-day",
    label: "Flagship 3-Day",
    summary:
      "The main commercial family for guests who want a serious but still readable East Java route without stepping into full overland length.",
    compareNote:
      "Compare the 3-day family by route order and finish logic, not just by whether the same destination names appear in the title.",
    routeOrder,
    finishLogic,
    priority: 4,
  };
}

export function getTourFamilyGuideItems(tours: ListTourPackage[]) {
  const familyMap = new Map<TourFamilyId, TourFamilyMeta>();

  tours.forEach((tour) => {
    const meta = getTourFamilyMeta(tour);
    if (!familyMap.has(meta.id)) {
      familyMap.set(meta.id, meta);
    }
  });

  return [...familyMap.values()].sort((a, b) => a.priority - b.priority);
}
