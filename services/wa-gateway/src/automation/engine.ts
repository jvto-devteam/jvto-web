import { config } from "../config";
import { findQuickReplyByIntent } from "../db/repository";
import {
  AutomationDecision,
  ConfidenceBucket,
  IntentResult,
  Ruleset,
  SlotState,
} from "../types";

const HANDOFF_TERMS: Array<{ reason: string; terms: string[] }> = [
  {
    reason: "medical_risk",
    terms: [
      "asthma",
      "pregnant",
      "heart condition",
      "panic attack",
      "medical issue",
      "unfit",
    ],
  },
  {
    reason: "refund_dispute",
    terms: ["refund dispute", "chargeback", "dispute", "lawyer", "complaint", "scam"],
  },
  {
    reason: "booking_amendment",
    terms: [
      "change booking",
      "reschedule booking",
      "booking code",
      "voucher correction",
      "amend my booking",
    ],
  },
];

const SAFE_LINKS: Record<string, string> = {
  price_and_package: `${config.publicBaseUrl}/tours`,
  availability_and_schedule: `${config.publicBaseUrl}/tours`,
  inclusions_exclusions: `${config.publicBaseUrl}/policy/inclusions-exclusions`,
  booking_and_payment: `${config.publicBaseUrl}/policy/booking-payment-cancellation`,
  pickup_dropoff: `${config.publicBaseUrl}/travel-guide/faq`,
  cancellation_reschedule: `${config.publicBaseUrl}/policy/booking-payment-cancellation`,
  ijen_health_screening: `${config.publicBaseUrl}/travel-guide/faq`,
  gear_weather_difficulty: `${config.publicBaseUrl}/travel-guide/faq`,
  private_vs_shared_custom: `${config.publicBaseUrl}/tours`,
  trust_and_verification: `${config.publicBaseUrl}/verify-jvto`,
};

export function extractSlots(text: string): SlotState {
  const lower = text.toLowerCase();
  const slots: SlotState = {};

  if (
    /\b\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?\b/.test(lower) ||
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(
      lower,
    )
  ) {
    slots.travel_dates = "present";
  }
  const pax = lower.match(/\b(\d+)\s*(pax|people|persons|guests|travellers|travelers)\b/);
  if (pax?.[1]) {
    slots.pax_total = pax[1];
  }
  const pickupCities = ["surabaya", "malang", "bali", "banyuwangi", "bondowoso", "probolinggo"];
  const pickup = pickupCities.find((city) => lower.includes(city));
  if (pickup) {
    slots.pickup_city = pickup;
  }
  const tours = ["bromo", "ijen", "tumpak sewu", "madakaripura", "combo"];
  const tour = tours.find((item) => lower.includes(item));
  if (tour) {
    slots.tour_preference = tour;
  }

  return slots;
}

function detectHandoffReason(text: string): string | null {
  const lower = text.toLowerCase();
  for (const entry of HANDOFF_TERMS) {
    if (entry.terms.some((term) => lower.includes(term))) {
      return entry.reason;
    }
  }
  return null;
}

export function detectIntent(text: string, ruleset: Ruleset): IntentResult {
  const lower = text.toLowerCase();
  const immediateHandoff = detectHandoffReason(lower);
  if (immediateHandoff) {
    return {
      intentId: null,
      confidence: "high",
      matchedKeywords: [],
      handoffReason: immediateHandoff,
    };
  }

  let best: { id: string; score: number; matchedKeywords: string[] } | null = null;
  for (const intent of ruleset.intents) {
    const matchedKeywords = intent.keywords.filter((keyword) =>
      lower.includes(keyword.toLowerCase()),
    );
    if (matchedKeywords.length === 0) {
      continue;
    }
    const score = matchedKeywords.length * 10 - intent.priority;
    if (!best || score > best.score) {
      best = { id: intent.id, score, matchedKeywords };
    }
  }

  if (!best) {
    return {
      intentId: null,
      confidence: "none",
      matchedKeywords: [],
      handoffReason: null,
    };
  }

  const confidence: ConfidenceBucket =
    best.matchedKeywords.length >= 3
      ? "high"
      : best.matchedKeywords.length === 2
        ? "medium"
        : "low";

  return {
    intentId: best.id,
    confidence,
    matchedKeywords: best.matchedKeywords,
    handoffReason: null,
  };
}

function nextMissingSlot(slotState: SlotState, ruleset: Ruleset): string | null {
  for (const slot of ruleset.required_slots) {
    if (!slotState[slot as keyof SlotState]) {
      return slot;
    }
  }
  return null;
}

function buildSlotPrompt(slotName: string): string {
  const prompts: Record<string, string> = {
    travel_dates: "What travel date are you considering?",
    pax_total: "How many guests are in your group?",
    pickup_city: "Where should JVTO pick you up?",
    tour_preference: "Which route are you considering: Bromo, Ijen, Tumpak Sewu, or a combo?",
  };
  return prompts[slotName] || "Could you share one more detail so we can guide you accurately?";
}

function withSafeLink(intentId: string | null, body: string): string {
  if (!intentId) {
    return body;
  }
  const link = SAFE_LINKS[intentId];
  if (!link) {
    return body;
  }
  return `${body}\n\nHelpful link: ${link}`;
}

export async function buildAutomationDecision(input: {
  text: string;
  recentGuestContext: string;
  ruleset: Ruleset;
  botTurns: number;
}): Promise<AutomationDecision> {
  const combinedContext = `${input.recentGuestContext}\n${input.text}`.trim();
  const slotState = extractSlots(combinedContext);
  const intent = detectIntent(input.text, input.ruleset);

  if (intent.handoffReason) {
    return {
      shouldReply: true,
      shouldHandoff: true,
      replyText: input.ruleset.global_templates.handoff,
      intentId: intent.intentId,
      confidence: intent.confidence,
      handoffReason: intent.handoffReason,
    };
  }

  if (input.botTurns >= input.ruleset.defaults.max_auto_replies_before_handoff) {
    return {
      shouldReply: true,
      shouldHandoff: true,
      replyText: input.ruleset.global_templates.handoff,
      intentId: intent.intentId,
      confidence: intent.confidence,
      handoffReason: "max_auto_replies_reached",
    };
  }

  if (!intent.intentId) {
    const shouldEscalate = input.botTurns >= 1;
    return {
      shouldReply: true,
      shouldHandoff: shouldEscalate,
      replyText: shouldEscalate
        ? input.ruleset.global_templates.handoff
        : input.ruleset.global_templates.fallback,
      intentId: null,
      confidence: "none",
      handoffReason: shouldEscalate ? "unclear_request" : null,
    };
  }

  const definition = input.ruleset.intents.find((item) => item.id === intent.intentId);
  if (!definition) {
    return {
      shouldReply: false,
      shouldHandoff: false,
      replyText: null,
      intentId: null,
      confidence: "none",
      handoffReason: null,
    };
  }

  const quickReply = await findQuickReplyByIntent(definition.id);
  let replyText = quickReply?.body || definition.reply_template;

  if (new Set(["price_and_package", "availability_and_schedule"]).has(definition.id)) {
    const missing = nextMissingSlot(slotState, input.ruleset);
    if (missing) {
      replyText = `${replyText}\n\n${buildSlotPrompt(missing)}`;
    }
  }

  if (definition.always_handoff) {
    return {
      shouldReply: true,
      shouldHandoff: true,
      replyText: `${replyText}\n\n${input.ruleset.global_templates.handoff}`,
      intentId: definition.id,
      confidence: intent.confidence,
      handoffReason: "always_handoff_intent",
    };
  }

  if (
    definition.handoff_if_contains?.some((term) =>
      input.text.toLowerCase().includes(term.toLowerCase()),
    )
  ) {
    return {
      shouldReply: true,
      shouldHandoff: true,
      replyText: `${replyText}\n\n${input.ruleset.global_templates.handoff}`,
      intentId: definition.id,
      confidence: intent.confidence,
      handoffReason: "intent_specific_handoff",
    };
  }

  return {
    shouldReply: true,
    shouldHandoff: false,
    replyText: withSafeLink(definition.id, replyText),
    intentId: definition.id,
    confidence: intent.confidence,
    handoffReason: null,
  };
}
