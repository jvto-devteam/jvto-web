import type { ListTourPackage } from "@/types";

export interface IsicEligibleRoute {
  internalStudentSlug: string;
  publicRouteSlug: string;
}

// Phase-two baseline pinned these student-package rows as internal-only mirror rows.
// The public ISIC page should therefore resolve to the underlying public routes that
// remain bookable, while keeping student-price verification as a separate step.
export const ISIC_ELIGIBLE_ROUTE_MAP: readonly IsicEligibleRoute[] = [
  {
    internalStudentSlug: "tours/student-package/bromo-ijen-3d2n",
    publicRouteSlug: "tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
  },
  {
    internalStudentSlug: "tours/student-package/bromo-ijen-3d2n-to-bali",
    publicRouteSlug: "tours/from-surabaya/bromo-madakaripura-ijen-3d2n",
  },
  {
    internalStudentSlug: "tours/student-package/ijen-bromo-3d2n",
    publicRouteSlug: "tours/from-bali/ijen-bromo-madakaripura-3d2n",
  },
  {
    internalStudentSlug: "tours/student-package/ijen-bromo-madakaripura-night-market-4d3n",
    publicRouteSlug: "tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
  },
  {
    internalStudentSlug: "tours/student-package/ijen-papuma-tumpak-sewu-bromo-4d3n",
    publicRouteSlug: "tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n",
  },
  {
    internalStudentSlug: "tours/student-package/ijen-papuma-tumpak-sewu-bromo-5d4n",
    publicRouteSlug: "tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
  },
] as const;

export function getIsicEligibleTours(
  tours: ListTourPackage[],
): ListTourPackage[] {
  const bySlug = new Map(tours.map((tour) => [tour.slug, tour]));

  return ISIC_ELIGIBLE_ROUTE_MAP.map(({ publicRouteSlug }) =>
    bySlug.get(publicRouteSlug),
  ).filter((tour): tour is ListTourPackage => Boolean(tour));
}
