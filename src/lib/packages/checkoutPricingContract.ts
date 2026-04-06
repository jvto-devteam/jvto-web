import {
  calculateInitialPaymentAmount,
  getInitialPaymentMode,
  type InitialPaymentMode,
} from "@/lib/packages/paymentPolicy";
import {
  formatPriceTierRange,
  getLowestTierPrice,
  getMatchingPriceTier,
  getPriceForPax,
  type PriceTierLike,
} from "@/lib/packages/priceTiers";

export interface CheckoutAddOnLine {
  addOnId?: string;
  label?: string;
  price: number;
  qty: number;
  subtotal: number;
  type?: string | null;
  transportType?: string | null;
  transportDestination?: string | null;
}

export interface CheckoutPricingSnapshot {
  pax: number;
  date: string;
  pricePerPerson: number | null;
  selectedTierLabel: string;
  publicStartingPrice: number | null;
  totalPackage: number;
  totalAddons: number;
  totalDiscount: number;
  discountLabel: string;
  grandTotal: number;
  downPayment: number;
  paymentMode: InitialPaymentMode;
}

export interface CheckoutPricingAudit extends CheckoutPricingSnapshot {
  priceTiers: PriceTierLike[];
  addonLines: CheckoutAddOnLine[];
}

export interface CheckoutPricingSelection {
  numb_of_pax: number;
  payment_method?: string;
  down_payment: number;
  total_package: number;
  total_addons: number;
  grand_total: number;
  total_discount: number;
  addons?: Array<{ id?: string; name?: string; price?: number }>;
}

export interface CheckoutPricingContractValidation {
  valid: boolean;
  errors: string[];
  normalized: CheckoutPricingSnapshot;
  expectedPaymentMethod: "cc" | "bank";
}

function roundIDR(value: number) {
  return Math.round(value);
}

function normalizeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateCheckoutGroupDiscount(
  pax: number,
  pricePerPerson: number | null,
) {
  if (!pricePerPerson) {
    return { amount: 0, label: "" };
  }

  if (pax >= 50) {
    return { amount: pricePerPerson * 3, label: "FOC: 3 Pax Free" };
  }

  if (pax >= 34) {
    return { amount: pricePerPerson * 2, label: "FOC: 2 Pax Free" };
  }

  if (pax >= 18) {
    return { amount: pricePerPerson * 1, label: "FOC: 1 Pax Free" };
  }

  return { amount: 0, label: "" };
}

export function buildCheckoutPricingSnapshot(input: {
  pax: number;
  date: string;
  priceTiers: PriceTierLike[] | null | undefined;
  addonLines?: CheckoutAddOnLine[] | null | undefined;
}): CheckoutPricingSnapshot {
  const pax = Math.max(0, normalizeNumber(input.pax));
  const priceTiers = input.priceTiers ?? [];
  const addonLines = input.addonLines ?? [];
  const pricePerPerson = getPriceForPax(pax, priceTiers);
  const selectedTier = getMatchingPriceTier(pax, priceTiers);
  const selectedTierLabel = formatPriceTierRange(selectedTier);
  const publicStartingPrice = getLowestTierPrice(priceTiers);
  const totalPackage = pricePerPerson ? roundIDR(pricePerPerson * pax) : 0;
  const totalAddons = roundIDR(
    addonLines.reduce((sum, item) => sum + normalizeNumber(item.subtotal), 0),
  );
  const discount = calculateCheckoutGroupDiscount(pax, pricePerPerson);
  const totalDiscount = roundIDR(discount.amount);
  const grandTotal = Math.max(0, totalPackage + totalAddons - totalDiscount);
  const downPayment = roundIDR(
    calculateInitialPaymentAmount(input.date, grandTotal),
  );

  return {
    pax,
    date: input.date,
    pricePerPerson,
    selectedTierLabel,
    publicStartingPrice,
    totalPackage,
    totalAddons,
    totalDiscount,
    discountLabel: discount.label,
    grandTotal,
    downPayment,
    paymentMode: getInitialPaymentMode(input.date),
  };
}

export function buildCheckoutPricingAudit(input: {
  pax: number;
  date: string;
  priceTiers: PriceTierLike[] | null | undefined;
  addonLines?: CheckoutAddOnLine[] | null | undefined;
}): CheckoutPricingAudit {
  const normalized = buildCheckoutPricingSnapshot(input);

  return {
    ...normalized,
    priceTiers: [...(input.priceTiers ?? [])],
    addonLines: [...(input.addonLines ?? [])],
  };
}

export function validateCheckoutPricingContract(input: {
  pricingAudit: CheckoutPricingAudit;
  bookingSelection: CheckoutPricingSelection;
}): CheckoutPricingContractValidation {
  const { pricingAudit, bookingSelection } = input;
  const normalized = buildCheckoutPricingSnapshot({
    pax: pricingAudit.pax,
    date: pricingAudit.date,
    priceTiers: pricingAudit.priceTiers,
    addonLines: pricingAudit.addonLines,
  });
  const expectedPaymentMethod =
    normalized.paymentMode === "full-payment-manual" ? "bank" : "cc";
  const errors: string[] = [];

  const compare = (label: string, actual: number, expected: number) => {
    if (roundIDR(actual) !== roundIDR(expected)) {
      errors.push(`${label} mismatch: received ${actual}, expected ${expected}`);
    }
  };

  compare("pricingAudit.pax", pricingAudit.pax, normalized.pax);
  compare(
    "pricingAudit.pricePerPerson",
    pricingAudit.pricePerPerson ?? 0,
    normalized.pricePerPerson ?? 0,
  );
  compare(
    "pricingAudit.totalPackage",
    pricingAudit.totalPackage,
    normalized.totalPackage,
  );
  compare(
    "pricingAudit.totalAddons",
    pricingAudit.totalAddons,
    normalized.totalAddons,
  );
  compare(
    "pricingAudit.totalDiscount",
    pricingAudit.totalDiscount,
    normalized.totalDiscount,
  );
  compare(
    "pricingAudit.grandTotal",
    pricingAudit.grandTotal,
    normalized.grandTotal,
  );
  compare(
    "pricingAudit.downPayment",
    pricingAudit.downPayment,
    normalized.downPayment,
  );

  compare(
    "bookingSelection.numb_of_pax",
    bookingSelection.numb_of_pax,
    normalized.pax,
  );
  compare(
    "bookingSelection.total_package",
    bookingSelection.total_package,
    normalized.totalPackage,
  );
  compare(
    "bookingSelection.total_addons",
    bookingSelection.total_addons,
    normalized.totalAddons,
  );
  compare(
    "bookingSelection.total_discount",
    bookingSelection.total_discount,
    normalized.totalDiscount,
  );
  compare(
    "bookingSelection.grand_total",
    bookingSelection.grand_total,
    normalized.grandTotal,
  );
  compare(
    "bookingSelection.down_payment",
    bookingSelection.down_payment,
    normalized.downPayment,
  );

  if (pricingAudit.selectedTierLabel !== normalized.selectedTierLabel) {
    errors.push(
      `pricingAudit.selectedTierLabel mismatch: received "${pricingAudit.selectedTierLabel}", expected "${normalized.selectedTierLabel}"`,
    );
  }

  if ((bookingSelection.payment_method ?? "") !== expectedPaymentMethod) {
    errors.push(
      `bookingSelection.payment_method mismatch: received "${bookingSelection.payment_method}", expected "${expectedPaymentMethod}"`,
    );
  }

  if (
    Array.isArray(bookingSelection.addons) &&
    bookingSelection.addons.length !== pricingAudit.addonLines.length
  ) {
    errors.push(
      `bookingSelection.addons count mismatch: received ${bookingSelection.addons.length}, expected ${pricingAudit.addonLines.length}`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    normalized,
    expectedPaymentMethod,
  };
}
