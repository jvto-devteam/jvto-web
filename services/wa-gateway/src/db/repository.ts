import {
  ConfidenceBucket,
  ContactRow,
  ConversationRow,
  MessageDirection,
  MessageType,
  SenderType,
} from "../types";
import { normalizePhone } from "../utils/phone";
import { query } from "./client";

function nowIso(): string {
  return new Date().toISOString();
}

export async function upsertAccount(status: {
  accountPhone: string;
  displayName?: string | null;
  connectionStatus: string;
  isConnected: boolean;
  pairedDevice?: Record<string, unknown>;
  qrText?: string | null;
  lastError?: string | null;
}): Promise<void> {
  await query(
    `
      INSERT INTO wa_accounts (
        account_phone,
        display_name,
        connection_status,
        is_connected,
        paired_device,
        last_qr_text,
        last_seen,
        last_error,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, NOW(), $7, NOW())
      ON CONFLICT (account_phone) DO UPDATE SET
        display_name = COALESCE(EXCLUDED.display_name, wa_accounts.display_name),
        connection_status = EXCLUDED.connection_status,
        is_connected = EXCLUDED.is_connected,
        paired_device = EXCLUDED.paired_device,
        last_qr_text = EXCLUDED.last_qr_text,
        last_seen = NOW(),
        last_error = EXCLUDED.last_error,
        updated_at = NOW()
    `,
    [
      status.accountPhone,
      status.displayName ?? null,
      status.connectionStatus,
      status.isConnected,
      JSON.stringify(status.pairedDevice ?? {}),
      status.qrText ?? null,
      status.lastError ?? null,
    ],
  );
}

export async function logGatewayEvent(
  eventType: string,
  severity: string,
  message: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  await query(
    `
      INSERT INTO wa_gateway_events (event_type, severity, message, payload)
      VALUES ($1, $2, $3, $4::jsonb)
    `,
    [eventType, severity, message, JSON.stringify(payload)],
  );
}

export async function upsertContact(
  phone: string,
  displayName?: string | null,
): Promise<ContactRow> {
  const normalized = normalizePhone(phone);
  const result = await query<ContactRow>(
    `
      INSERT INTO wa_contacts (phone, normalized_phone, display_name, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (normalized_phone) DO UPDATE SET
        phone = EXCLUDED.phone,
        display_name = COALESCE(EXCLUDED.display_name, wa_contacts.display_name),
        updated_at = NOW()
      RETURNING id::text, phone, normalized_phone, display_name, linked_customer_id::text, linked_booking_id::text
    `,
    [phone, normalized, displayName ?? null],
  );

  const contact = result.rows[0];
  await linkContactToCustomerAndBooking(contact.id, normalized);

  const refreshed = await query<ContactRow>(
    `
      SELECT id::text, phone, normalized_phone, display_name, linked_customer_id::text, linked_booking_id::text
      FROM wa_contacts
      WHERE id = $1
    `,
    [contact.id],
  );

  return refreshed.rows[0];
}

export async function linkContactToCustomerAndBooking(
  contactId: string,
  normalizedPhone: string,
): Promise<void> {
  const customer = await query<{ id: string }>(
    `
      SELECT id::text
      FROM customers
      WHERE regexp_replace(COALESCE(phone, ''), '\\D', '', 'g') = $1
      LIMIT 1
    `,
    [normalizedPhone],
  );

  if (!customer.rows[0]) {
    return;
  }

  const customerId = customer.rows[0].id;
  const booking = await query<{ id: string }>(
    `
      SELECT id::text
      FROM bookings
      WHERE customer_id = $1
        AND deleted_at IS NULL
        AND start_date >= CURRENT_DATE - INTERVAL '30 days'
        AND booking_status NOT IN ('CANCELLED', 'VOID')
      ORDER BY start_date ASC
      LIMIT 1
    `,
    [customerId],
  );

  await query(
    `
      UPDATE wa_contacts
      SET linked_customer_id = $2,
          linked_booking_id = $3,
          lifecycle_stage = CASE WHEN $3 IS NULL THEN lifecycle_stage ELSE 'booked' END,
          updated_at = NOW()
      WHERE id = $1
    `,
    [contactId, customerId, booking.rows[0]?.id ?? null],
  );
}

export async function linkContactToBooking(
  contactId: string,
  bookingId: string,
): Promise<void> {
  const booking = await query<{ id: string; customer_id: string | null }>(
    `
      SELECT id::text, customer_id::text
      FROM bookings
      WHERE id = $1
      LIMIT 1
    `,
    [bookingId],
  );

  if (!booking.rows[0]) {
    throw new Error("Booking not found");
  }

  await query(
    `
      UPDATE wa_contacts
      SET linked_booking_id = $2,
          linked_customer_id = COALESCE($3, linked_customer_id),
          lifecycle_stage = 'booked',
          updated_at = NOW()
      WHERE id = $1
    `,
    [contactId, booking.rows[0].id, booking.rows[0].customer_id],
  );
}

export async function getOrCreateConversation(contactId: string): Promise<ConversationRow> {
  const existing = await query<ConversationRow>(
    `
      SELECT id::text, contact_id::text, status, bot_paused_until::text
      FROM wa_conversations
      WHERE contact_id = $1
      LIMIT 1
    `,
    [contactId],
  );

  if (existing.rows[0]) {
    return existing.rows[0];
  }

  const created = await query<ConversationRow>(
    `
      INSERT INTO wa_conversations (contact_id, status, last_message_at, updated_at)
      VALUES ($1, 'open', NOW(), NOW())
      RETURNING id::text, contact_id::text, status, bot_paused_until::text
    `,
    [contactId],
  );

  return created.rows[0];
}

export async function updateConversationActivity(
  conversationId: string,
  status?: string,
): Promise<void> {
  await query(
    `
      UPDATE wa_conversations
      SET last_message_at = NOW(),
          status = COALESCE($2, status),
          updated_at = NOW()
      WHERE id = $1
    `,
    [conversationId, status ?? null],
  );
}

export async function pauseConversation(
  conversationId: string,
  minutes: number,
  reason: string,
): Promise<void> {
  await query(
    `
      UPDATE wa_conversations
      SET status = 'handoff',
          handoff_reason = $2,
          bot_paused_until = NOW() + make_interval(mins => $3),
          updated_at = NOW()
      WHERE id = $1
    `,
    [conversationId, reason, minutes],
  );
}

export async function resumeConversation(conversationId: string): Promise<void> {
  await query(
    `
      UPDATE wa_conversations
      SET status = 'open',
          handoff_reason = NULL,
          bot_paused_until = NULL,
          updated_at = NOW()
      WHERE id = $1
    `,
    [conversationId],
  );
}

export async function getConversation(conversationId: string): Promise<ConversationRow | null> {
  const result = await query<ConversationRow>(
    `
      SELECT id::text, contact_id::text, status, bot_paused_until::text
      FROM wa_conversations
      WHERE id = $1
      LIMIT 1
    `,
    [conversationId],
  );
  return result.rows[0] ?? null;
}

export async function getConversationContactPhone(
  conversationId: string,
): Promise<string | null> {
  const result = await query<{ phone: string }>(
    `
      SELECT c.phone
      FROM wa_conversations conv
      JOIN wa_contacts c ON c.id = conv.contact_id
      WHERE conv.id = $1
      LIMIT 1
    `,
    [conversationId],
  );
  return result.rows[0]?.phone ?? null;
}

export async function hasStoredMessage(waMessageId: string): Promise<boolean> {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS(SELECT 1 FROM wa_messages WHERE wa_message_id = $1) AS exists`,
    [waMessageId],
  );
  return Boolean(result.rows[0]?.exists);
}

export async function storeMessage(input: {
  conversationId: string;
  waMessageId: string;
  direction: MessageDirection;
  senderType: SenderType;
  messageType: MessageType;
  body: string;
  normalizedText?: string | null;
  sentAt?: string;
  deliveryStatus?: string;
  rawPayload?: Record<string, unknown>;
}): Promise<string | null> {
  const result = await query<{ id: string }>(
    `
      INSERT INTO wa_messages (
        conversation_id,
        wa_message_id,
        direction,
        sender_type,
        message_type,
        body,
        normalized_text,
        sent_at,
        delivery_status,
        raw_payload
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $9, $10::jsonb)
      ON CONFLICT (wa_message_id) DO NOTHING
      RETURNING id::text
    `,
    [
      input.conversationId,
      input.waMessageId,
      input.direction,
      input.senderType,
      input.messageType,
      input.body,
      input.normalizedText ?? null,
      input.sentAt ?? nowIso(),
      input.deliveryStatus ?? "received",
      JSON.stringify(input.rawPayload ?? {}),
    ],
  );

  await updateConversationActivity(
    input.conversationId,
    input.senderType === "bot" ? "bot_active" : undefined,
  );

  return result.rows[0]?.id ?? null;
}

export async function storeIntentEvent(input: {
  messageId: string | null;
  detectedIntent: string | null;
  confidence: ConfidenceBucket;
  autoReplied: boolean;
  handoffTrigger: string | null;
}): Promise<void> {
  if (!input.messageId) {
    return;
  }
  await query(
    `
      INSERT INTO wa_intent_events (
        message_id,
        detected_intent,
        confidence_bucket,
        auto_replied,
        handoff_trigger
      )
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      input.messageId,
      input.detectedIntent,
      input.confidence,
      input.autoReplied,
      input.handoffTrigger,
    ],
  );
}

export async function getRecentGuestContext(
  conversationId: string,
): Promise<string> {
  const result = await query<{ body: string }>(
    `
      SELECT body
      FROM wa_messages
      WHERE conversation_id = $1
        AND sender_type = 'guest'
      ORDER BY sent_at DESC
      LIMIT 6
    `,
    [conversationId],
  );

  return result.rows
    .map((row) => row.body)
    .reverse()
    .join("\n");
}

export async function countRecentBotTurns(
  conversationId: string,
): Promise<number> {
  const result = await query<{ total: string }>(
    `
      SELECT COUNT(*)::text AS total
      FROM wa_messages
      WHERE conversation_id = $1
        AND sender_type = 'bot'
        AND sent_at >= NOW() - INTERVAL '24 hours'
    `,
    [conversationId],
  );
  return Number(result.rows[0]?.total ?? 0);
}

export async function findQuickReplyByIntent(
  intentId: string,
): Promise<{ body: string } | null> {
  const result = await query<{ body: string }>(
    `
      SELECT body
      FROM wa_quick_replies
      WHERE intent_id = $1
        AND is_active = TRUE
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
    `,
    [intentId],
  );
  return result.rows[0] ?? null;
}

export async function seedQuickReplies(
  replies: Array<{
    slug: string;
    intentId: string;
    title: string;
    body: string;
    sortOrder: number;
  }>,
): Promise<void> {
  for (const reply of replies) {
    await query(
      `
        INSERT INTO wa_quick_replies (slug, intent_id, title, body, is_active, sort_order, updated_at)
        VALUES ($1, $2, $3, $4, TRUE, $5, NOW())
        ON CONFLICT (slug) DO NOTHING
      `,
      [reply.slug, reply.intentId, reply.title, reply.body, reply.sortOrder],
    );
  }
}
