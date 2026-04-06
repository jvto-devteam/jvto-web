import {
  getInitialPaymentNarrative,
  getPaymentLogicNarrative,
} from "@/lib/packages/paymentPolicy";

export type BookingConfidenceLink = {
  label: string;
  href: string;
};

export type BookingConfidenceStep = {
  title: string;
  copy: string;
};

export type BookingConfidenceModule = {
  eyebrow: string;
  title: string;
  paymentNowLabel: string;
  paymentNowCopy: string;
  logicNoteTitle: string;
  logicNoteCopy: string;
  steps: BookingConfidenceStep[];
  links: BookingConfidenceLink[];
};

type BookingConfidenceInput = {
  total: number;
  dateStr?: string | null;
};

export function buildBookingConfidence({
  total,
  dateStr,
}: BookingConfidenceInput): BookingConfidenceModule {
  const paymentNarrative = getInitialPaymentNarrative(dateStr);
  const logicNarrative = getPaymentLogicNarrative(dateStr);

  return {
    eyebrow: "Booking confidence",
    title: "Know what locks the route before you pay.",
    paymentNowLabel:
      total > 0 ? paymentNarrative.label : "Standard payment gate",
    paymentNowCopy:
      total > 0
        ? paymentNarrative.copy
        : "Normal bookings more than 7 days before Day 1 usually begin with a 20% deposit. Once the route falls within 7 days, JVTO can move the booking into full-payment handling.",
    logicNoteTitle: logicNarrative.title,
    logicNoteCopy: `${logicNarrative.currentCase} ${logicNarrative.framework}`,
    steps: [
      {
        title: "Confirmation trigger",
        copy: "A route is treated as confirmed after payment is processed and the Official E-Voucher is issued.",
      },
      {
        title: "Balance timing",
        copy: "If balance remains, card settlement is due earlier than bank transfer or Wise. Use the booking page before choosing dates blindly.",
      },
      {
        title: "If plans change",
        copy: "Guest-initiated cancellations use Travel Credit logic or forfeiture based on timing. Policy rules still govern the final outcome.",
      },
    ],
    links: [
      {
        label: "Booking Information",
        href: "/travel-guide/booking-information",
      },
      {
        label: "Cancellation Policy",
        href: "/policy/booking-payment-cancellation",
      },
    ],
  };
}
