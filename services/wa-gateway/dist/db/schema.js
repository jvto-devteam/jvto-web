"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSchema = ensureSchema;
const client_1 = require("./client");
async function ensureSchema() {
    await (0, client_1.query)(`
    CREATE TABLE IF NOT EXISTS wa_accounts (
      id BIGSERIAL PRIMARY KEY,
      account_phone VARCHAR(32) NOT NULL UNIQUE,
      display_name TEXT,
      connection_status TEXT NOT NULL DEFAULT 'booting',
      is_connected BOOLEAN NOT NULL DEFAULT FALSE,
      paired_device JSONB NOT NULL DEFAULT '{}'::jsonb,
      last_qr_text TEXT,
      last_seen TIMESTAMPTZ,
      last_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_contacts (
      id BIGSERIAL PRIMARY KEY,
      phone VARCHAR(32) NOT NULL,
      normalized_phone VARCHAR(32) NOT NULL UNIQUE,
      display_name TEXT,
      language VARCHAR(10) NOT NULL DEFAULT 'en',
      country_guess VARCHAR(16),
      linked_customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
      linked_booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
      lifecycle_stage TEXT NOT NULL DEFAULT 'lead',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_conversations (
      id BIGSERIAL PRIMARY KEY,
      contact_id BIGINT NOT NULL UNIQUE REFERENCES wa_contacts(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'open',
      last_message_at TIMESTAMPTZ,
      handoff_reason TEXT,
      assigned_to TEXT,
      bot_paused_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_messages (
      id BIGSERIAL PRIMARY KEY,
      conversation_id BIGINT NOT NULL REFERENCES wa_conversations(id) ON DELETE CASCADE,
      wa_message_id TEXT NOT NULL UNIQUE,
      direction TEXT NOT NULL,
      sender_type TEXT NOT NULL,
      message_type TEXT NOT NULL,
      body TEXT NOT NULL,
      normalized_text TEXT,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      delivery_status TEXT NOT NULL DEFAULT 'received',
      raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_intent_events (
      id BIGSERIAL PRIMARY KEY,
      message_id BIGINT NOT NULL REFERENCES wa_messages(id) ON DELETE CASCADE,
      detected_intent TEXT,
      confidence_bucket TEXT NOT NULL DEFAULT 'none',
      auto_replied BOOLEAN NOT NULL DEFAULT FALSE,
      handoff_trigger TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_quick_replies (
      id BIGSERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      intent_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INT NOT NULL DEFAULT 100,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wa_gateway_events (
      id BIGSERIAL PRIMARY KEY,
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_wa_contacts_customer_id ON wa_contacts(linked_customer_id);
    CREATE INDEX IF NOT EXISTS idx_wa_contacts_booking_id ON wa_contacts(linked_booking_id);
    CREATE INDEX IF NOT EXISTS idx_wa_conversations_status ON wa_conversations(status);
    CREATE INDEX IF NOT EXISTS idx_wa_messages_conversation_sent_at ON wa_messages(conversation_id, sent_at DESC);
    CREATE INDEX IF NOT EXISTS idx_wa_messages_sender_type ON wa_messages(sender_type);
    CREATE INDEX IF NOT EXISTS idx_wa_intent_events_message_id ON wa_intent_events(message_id);
    CREATE INDEX IF NOT EXISTS idx_wa_gateway_events_created_at ON wa_gateway_events(created_at DESC);
  `);
}
