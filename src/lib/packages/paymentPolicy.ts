export const FULL_PAYMENT_THRESHOLD_DAYS = 7;
export const MANUAL_VERIFICATION_THRESHOLD_DAYS = 5;
export const STANDARD_DEPOSIT_RATIO = 0.2;
export const CARD_BALANCE_DEADLINE_DAYS = 5;
export const BANK_TRANSFER_BALANCE_DEADLINE_DAYS = 3;

export const PAYMENT_GATE_RULE_COPY =
  "More than 7 days before Day 1 usually starts with a 20% deposit. At 7 days or less, JVTO can require full payment. The most urgent requests may also shift to manual verification before the route is locked.";

export const BALANCE_DEADLINE_RULE_COPY =
  "If a balance remains after deposit, card settlement is due 5 calendar days before Day 1, while bank transfer or Wise settlement is due 3 calendar days before Day 1.";

export const VOUCHER_CONFIRMATION_RULE_COPY =
  "A route is only treated as operationally confirmed after the required payment is processed and the Official E-Voucher is issued.";

export type InitialPaymentMode =
  | "deposit"
  | "full-payment-card"
  | "full-payment-manual";

export function getDaysUntilTrip(dateStr: string): number {
  if (!dateStr) return 0;

  const [y, m, d] = dateStr.split("-").map(Number);
  const tripDate = new Date(y, m - 1, d);
  tripDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = tripDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getInitialPaymentMode(dateStr: string): InitialPaymentMode {
  const diffDays = getDaysUntilTrip(dateStr);

  if (diffDays <= MANUAL_VERIFICATION_THRESHOLD_DAYS) {
    return "full-payment-manual";
  }

  if (diffDays <= FULL_PAYMENT_THRESHOLD_DAYS) {
    return "full-payment-card";
  }

  return "deposit";
}

export function calculateInitialPaymentAmount(dateStr: string, total: number) {
  const mode = getInitialPaymentMode(dateStr);
  if (mode === "deposit") {
    return Math.ceil(total * STANDARD_DEPOSIT_RATIO);
  }
  return total;
}

export function getPaymentLogicNarrative(dateStr?: string | null) {
  if (!dateStr) {
    return {
      title: "How JVTO reads payment timing",
      currentCase:
        "Timing decides whether the booking starts with a 20% deposit or full payment.",
      framework: `${BALANCE_DEADLINE_RULE_COPY} ${VOUCHER_CONFIRMATION_RULE_COPY}`,
    };
  }

  const mode = getInitialPaymentMode(dateStr);

  if (mode === "deposit") {
    return {
      title: "How JVTO reads payment timing",
      currentCase:
        "This route still sits outside the 7-day full-payment window, so the booking normally starts with a 20% deposit.",
      framework: `${BALANCE_DEADLINE_RULE_COPY} ${VOUCHER_CONFIRMATION_RULE_COPY}`,
    };
  }

  if (mode === "full-payment-card") {
    return {
      title: "How JVTO reads payment timing",
      currentCase:
        "This route is already inside the 7-day window, so the booking moves into full-payment handling before the route can be locked.",
      framework: VOUCHER_CONFIRMATION_RULE_COPY,
    };
  }

  return {
    title: "How JVTO reads payment timing",
    currentCase:
      "This route is in the urgent final window, so full payment is required and manual verification may be used before the route is locked.",
    framework: VOUCHER_CONFIRMATION_RULE_COPY,
  };
}

export function getInitialPaymentNarrative(dateStr?: string | null) {
  if (!dateStr) {
    return {
      mode: "deposit" as InitialPaymentMode,
      label: "Standard payment gate",
      copy:
        "Normal bookings more than 7 days before Day 1 usually start with a 20% deposit. Once the route falls within 7 days, JVTO can move the booking to full payment, and the most urgent requests can shift to manual verification.",
    };
  }

  const mode = getInitialPaymentMode(dateStr);

  if (mode === "deposit") {
    return {
      mode,
      label: "Current checkout estimate: 20% deposit",
      copy:
        "This trip is still more than 7 days away, so the standard rule is a 20% deposit first. The remaining balance follows the normal payment deadlines and the Official E-Voucher remains the binding confirmation record.",
    };
  }

  if (mode === "full-payment-card") {
    return {
      mode,
      label: "Current checkout estimate: full payment",
      copy:
        "This trip is now within 7 days of Day 1, so JVTO moves the booking into full-payment handling. The route is still only treated as confirmed after payment is processed and the Official E-Voucher is issued.",
    };
  }

  return {
    mode,
    label: "Current checkout estimate: full payment with manual verification",
    copy:
      "This trip is in the urgent final window. Full payment is required, and manual verification may be used before the route is locked. The Official E-Voucher remains the final operational confirmation.",
  };
}
