export interface PriceTierLike {
  paxMin: number;
  paxMax: number;
  pricePerPerson: number;
}

export function getMatchingPriceTier<T extends PriceTierLike>(
  pax: number,
  tiers: T[] | null | undefined,
): T | null {
  if (!tiers || !tiers.length) return null;

  return (
    tiers.find((tier) => {
      const minOk = pax >= tier.paxMin;
      const maxOk = tier.paxMax === 0 ? true : pax <= tier.paxMax;
      return minOk && maxOk;
    }) ?? null
  );
}

export function getPriceForPax(
  pax: number,
  tiers: PriceTierLike[] | null | undefined,
): number | null {
  const tier = getMatchingPriceTier(pax, tiers);
  return tier ? tier.pricePerPerson : null;
}

export function formatPriceTierRange(
  tier: PriceTierLike | null | undefined,
): string {
  if (!tier) return "Tier unavailable";
  if (tier.paxMax === 0) return `${tier.paxMin}+ travelers`;
  if (tier.paxMin === tier.paxMax) return `${tier.paxMin} travelers`;
  return `${tier.paxMin}-${tier.paxMax} travelers`;
}

export function getLowestTierPrice(
  tiers: PriceTierLike[] | null | undefined,
): number | null {
  if (!tiers || !tiers.length) return null;
  const values = tiers
    .map((tier) => tier.pricePerPerson)
    .filter((value) => typeof value === "number" && !Number.isNaN(value));
  return values.length ? Math.min(...values) : null;
}

export function getEntryReferencePrice(
  tiers: PriceTierLike[] | null | undefined,
): number | null {
  if (!tiers || !tiers.length) return null;

  const exactTwoPaxTier =
    tiers.find((tier) => tier.paxMin <= 2 && (tier.paxMax === 0 || tier.paxMax >= 2)) ??
    null;

  if (exactTwoPaxTier) {
    return exactTwoPaxTier.pricePerPerson;
  }

  return getLowestTierPrice(tiers);
}
