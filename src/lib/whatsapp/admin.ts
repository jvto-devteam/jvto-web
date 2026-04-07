import { db } from "@/lib/db";

export type GatewayStatus = {
  connected: boolean;
  accountPhone: string;
  connectionStatus: string;
  lastSeen: string | null;
  lastQrAt: string | null;
  uptimeSeconds: number;
  autoReplyEnabled: boolean;
};

export type QuickReplyRow = {
  id: string;
  slug: string;
  intent_id: string;
  title: string;
  body: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export type ConversationAdminRow = {
  id: string;
  status: string;
  handoff_reason: string | null;
  bot_paused_until: string | null;
  last_message_at: string | null;
  phone: string;
  display_name: string | null;
  linked_booking_id: string | null;
  linked_customer_id: string | null;
  contact_id: string;
};

export type MessageAdminRow = {
  id: string;
  sender_type: string;
  direction: string;
  body: string;
  sent_at: string;
  phone: string;
  display_name: string | null;
};

export type DashboardData = {
  schemaReady: boolean;
  account: Record<string, unknown> | null;
  handoffs: ConversationAdminRow[];
  conversations: ConversationAdminRow[];
  messages: MessageAdminRow[];
  quickReplies: QuickReplyRow[];
};

function isMissingSchema(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

function gatewayConfig(): { baseUrl: string; token: string } {
  const baseUrl = process.env.WA_GATEWAY_BASE_URL;
  const token = process.env.WA_GATEWAY_TOKEN;
  if (!baseUrl || !token) {
    throw new Error("Missing WA_GATEWAY_BASE_URL or WA_GATEWAY_TOKEN");
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), token };
}

export async function gatewayFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const { baseUrl, token } = gatewayConfig();
  const headers = new Headers(init?.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function getGatewayStatus(): Promise<GatewayStatus | null> {
  try {
    const response = await gatewayFetch("/session/status");
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as GatewayStatus;
  } catch {
    return null;
  }
}

export async function getWhatsappDashboardData(): Promise<DashboardData> {
  try {
    const [account] = await db<Record<string, unknown>>(
      `
        SELECT
          id::text,
          account_phone,
          display_name,
          connection_status,
          is_connected,
          last_seen::text,
          updated_at::text,
          last_error
        FROM wa_accounts
        ORDER BY updated_at DESC
        LIMIT 1
      `,
    );

    const handoffs = await db<ConversationAdminRow>(
      `
        SELECT
          conv.id::text,
          conv.status,
          conv.handoff_reason,
          conv.bot_paused_until::text,
          conv.last_message_at::text,
          c.phone,
          c.display_name,
          c.linked_booking_id::text,
          c.linked_customer_id::text,
          c.id::text AS contact_id
        FROM wa_conversations conv
        JOIN wa_contacts c ON c.id = conv.contact_id
        WHERE conv.status = 'handoff'
        ORDER BY conv.updated_at DESC
        LIMIT 12
      `,
    );

    const conversations = await db<ConversationAdminRow>(
      `
        SELECT
          conv.id::text,
          conv.status,
          conv.handoff_reason,
          conv.bot_paused_until::text,
          conv.last_message_at::text,
          c.phone,
          c.display_name,
          c.linked_booking_id::text,
          c.linked_customer_id::text,
          c.id::text AS contact_id
        FROM wa_conversations conv
        JOIN wa_contacts c ON c.id = conv.contact_id
        ORDER BY conv.last_message_at DESC NULLS LAST
        LIMIT 20
      `,
    );

    const messages = await db<MessageAdminRow>(
      `
        SELECT
          m.id::text,
          m.sender_type,
          m.direction,
          m.body,
          m.sent_at::text,
          c.phone,
          c.display_name
        FROM wa_messages m
        JOIN wa_conversations conv ON conv.id = m.conversation_id
        JOIN wa_contacts c ON c.id = conv.contact_id
        ORDER BY m.sent_at DESC
        LIMIT 40
      `,
    );

    const quickReplies = await db<QuickReplyRow>(
      `
        SELECT
          id::text,
          slug,
          intent_id,
          title,
          body,
          is_active,
          sort_order,
          updated_at::text
        FROM wa_quick_replies
        ORDER BY sort_order ASC, title ASC
      `,
    );

    return {
      schemaReady: true,
      account: account ?? null,
      handoffs,
      conversations,
      messages,
      quickReplies,
    };
  } catch (error) {
    if (isMissingSchema(error)) {
      return {
        schemaReady: false,
        account: null,
        handoffs: [],
        conversations: [],
        messages: [],
        quickReplies: [],
      };
    }
    throw error;
  }
}
