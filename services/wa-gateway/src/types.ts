export type ConversationStatus = "open" | "bot_active" | "handoff" | "closed";
export type MessageDirection = "inbound" | "outbound";
export type SenderType = "guest" | "bot" | "agent" | "system";
export type MessageType = "text" | "link";
export type ConfidenceBucket = "high" | "medium" | "low" | "none";

export type GatewayHealth = {
  connected: boolean;
  accountPhone: string;
  connectionStatus: string;
  lastSeen: string | null;
  lastQrAt: string | null;
  uptimeSeconds: number;
  autoReplyEnabled: boolean;
};

export type IntentDefinition = {
  id: string;
  priority: number;
  keywords: string[];
  reply_template: string;
  next_questions?: string[];
  always_handoff?: boolean;
  handoff_if_contains?: string[];
};

export type Ruleset = {
  version: string;
  scope: {
    whatsapp_number: string;
    brand: string;
    mode: string;
  };
  defaults: {
    language: string;
    fallback_language: string;
    max_auto_replies_before_handoff: number;
  };
  global_templates: {
    greeting: string;
    fallback: string;
    handoff: string;
  };
  required_slots: string[];
  intents: IntentDefinition[];
};

export type SlotState = {
  travel_dates?: string;
  pax_total?: string;
  pickup_city?: string;
  tour_preference?: string;
};

export type IntentResult = {
  intentId: string | null;
  confidence: ConfidenceBucket;
  matchedKeywords: string[];
  handoffReason: string | null;
};

export type AutomationDecision = {
  shouldReply: boolean;
  shouldHandoff: boolean;
  replyText: string | null;
  intentId: string | null;
  confidence: ConfidenceBucket;
  handoffReason: string | null;
};

export type ContactRow = {
  id: string;
  phone: string;
  normalized_phone: string;
  display_name: string | null;
  linked_customer_id: string | null;
  linked_booking_id: string | null;
};

export type ConversationRow = {
  id: string;
  contact_id: string;
  status: ConversationStatus;
  bot_paused_until: string | null;
};
