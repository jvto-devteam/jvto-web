// src/lib/policyBookingFaqs.ts
// Canonical FAQ for /policy/booking-payment-cancellation, composed ENTIRELY from
// the v2 policy-bundle SSOT (src/data/policy-bundle/*) so it can never drift from
// the canonical policy. Registered in resolveFaqs.ts CANONICAL_FAQ_REGISTRY, which
// makes it outrank (and suppress) the stale CMS/snapshot content.faq for this route
// — fixing both the visible FAQ and the FAQPage JSON-LD.
import type { QaPair } from "@/lib/tourFaqs";
import { getCustomerCopy, getPolicyNotes } from "@/lib/policy-bundle";

// Bundle `notes` carry markdown bold; strip it for plain FAQ answer text.
function plain(s: string): string {
  return s.replace(/\*\*/g, "").trim();
}

export const POLICY_BOOKING_CANCELLATION_FAQS: QaPair[] = [
  {
    question: "How do I book a JVTO tour?",
    answer: plain(getPolicyNotes("booking-paths")),
  },
  {
    question: "How much deposit do I pay, and when is the balance due?",
    answer: plain(getPolicyNotes("payment-rules")),
  },
  {
    question:
      "What happens if I cancel my whole booking 48 hours or more before Day 1?",
    answer: getCustomerCopy("before_48_full_cancellation"),
  },
  {
    question: "What if I cancel my whole booking within 48 hours of Day 1?",
    answer: getCustomerCopy("after_48_full_cancellation"),
  },
  {
    question: "What if one traveller cancels but the tour still goes ahead?",
    answer: getCustomerCopy("partial_cancellation"),
  },
  {
    question:
      "What if my flight is cancelled by a natural disruption such as volcanic ash?",
    answer: getCustomerCopy("flight_disruption"),
  },
  {
    question: "How do I use or transfer my Lifetime Package Credit?",
    answer: `${getCustomerCopy("package_redemption")} ${getCustomerCopy(
      "package_transfer",
    )}`.trim(),
  },
].filter((qa) => qa.answer.length > 0);
