import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  proto,
  useMultiFileAuthState as createMultiFileAuthState,
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import fs from "fs";
import { buildAutomationDecision } from "../automation/engine";
import { loadRuleset } from "../automation/templates";
import { config } from "../config";
import {
  countRecentBotTurns,
  getConversation,
  getConversationContactPhone,
  getOrCreateConversation,
  getRecentGuestContext,
  hasStoredMessage,
  linkContactToBooking,
  logGatewayEvent,
  pauseConversation,
  resumeConversation,
  seedQuickReplies,
  storeIntentEvent,
  storeMessage,
  upsertAccount,
  upsertContact,
} from "../db/repository";
import { logger } from "../logger";
import { GatewayHealth, SenderType } from "../types";
import { jidFromPhone, normalizePhone, phoneFromJid } from "../utils/phone";

function extractText(message?: proto.IMessage | null): string {
  if (!message) return "";
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  if (message.buttonsResponseMessage?.selectedDisplayText) {
    return message.buttonsResponseMessage.selectedDisplayText;
  }
  if (message.listResponseMessage?.title) return message.listResponseMessage.title;
  if (message.ephemeralMessage?.message) return extractText(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return extractText(message.viewOnceMessage.message);
  return "";
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function getMessageType(text: string): "text" | "link" {
  return /https?:\/\//i.test(text) ? "link" : "text";
}

export class WhatsappGateway {
  private sock: WASocket | null = null;
  private reconnectDelayMs = 2000;
  private readonly startedAt = Date.now();
  private connectionStatus = "booting";
  private isConnected = false;
  private lastSeen: string | null = null;
  private lastQrText: string | null = null;
  private lastQrDataUrl: string | null = null;
  private lastQrAt: string | null = null;
  private lastError: string | null = null;

  async start(): Promise<void> {
    fs.mkdirSync(config.sessionDir, { recursive: true });

    const ruleset = loadRuleset();
    await seedQuickReplies(
      ruleset.intents.map((intent, index) => ({
        slug: intent.id,
        intentId: intent.id,
        title: intent.id.replace(/_/g, " "),
        body: intent.reply_template,
        sortOrder: (index + 1) * 10,
      })),
    );

    await this.connect();
  }

  async connect(): Promise<void> {
    const { state, saveCreds } = await createMultiFileAuthState(config.sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
      browser: Browsers.ubuntu("JVTO WA Gateway"),
      markOnlineOnConnect: false,
      syncFullHistory: false,
    });

    this.sock.ev.on("creds.update", saveCreds);

    this.sock.ev.on("connection.update", async (update) => {
      if (update.qr) {
        this.lastQrText = update.qr;
        this.lastQrDataUrl = await QRCode.toDataURL(update.qr);
        this.lastQrAt = new Date().toISOString();
      }

      if (update.connection === "open") {
        this.connectionStatus = "open";
        this.isConnected = true;
        this.lastSeen = new Date().toISOString();
        this.reconnectDelayMs = 2000;
        this.lastError = null;
        await upsertAccount({
          accountPhone: config.jvtoNumber,
          connectionStatus: this.connectionStatus,
          isConnected: true,
          pairedDevice: { user: this.sock?.user ?? null },
          qrText: this.lastQrText,
        });
        await logGatewayEvent("connection", "info", "WhatsApp connection opened");
        logger.info("WhatsApp connection opened");
      }

      if (update.connection === "close") {
        this.connectionStatus = "closed";
        this.isConnected = false;
        const statusCode = (update.lastDisconnect?.error as Boom | undefined)?.output?.statusCode;
        this.lastError = update.lastDisconnect?.error?.message ?? null;
        await upsertAccount({
          accountPhone: config.jvtoNumber,
          connectionStatus: statusCode === DisconnectReason.loggedOut ? "logged_out" : "closed",
          isConnected: false,
          pairedDevice: { user: this.sock?.user ?? null },
          qrText: this.lastQrText,
          lastError: this.lastError,
        });
        await logGatewayEvent("connection", "warn", "WhatsApp connection closed", {
          statusCode,
          lastError: this.lastError,
        });
        logger.warn({ statusCode, lastError: this.lastError }, "WhatsApp connection closed");

        if (statusCode !== DisconnectReason.loggedOut) {
          setTimeout(() => {
            void this.connect();
          }, this.reconnectDelayMs);
          this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, 60000);
        }
      }
    });

    this.sock.ev.on("messages.upsert", async (event) => {
      for (const item of event.messages) {
        try {
          await this.handleMessage(item);
        } catch (error) {
          logger.error({ error }, "Failed to handle WhatsApp message");
          await logGatewayEvent("message_processing", "error", "Failed to handle message", {
            error: String(error),
          });
        }
      }
    });
  }

  private async handleMessage(message: proto.IWebMessageInfo): Promise<void> {
    const remoteJid = message.key.remoteJid;
    if (!remoteJid || remoteJid === "status@broadcast" || remoteJid.endsWith("@g.us")) {
      return;
    }

    const waMessageId = message.key.id;
    if (!waMessageId || (await hasStoredMessage(waMessageId))) {
      return;
    }

    const phone = phoneFromJid(remoteJid);
    const text = extractText(message.message);
    if (!text.trim()) {
      return;
    }

    const displayName = message.pushName || (message.key.fromMe ? "JVTO Operator" : null);
    const contact = await upsertContact(phone, displayName);
    const conversation = await getOrCreateConversation(contact.id);
    const sentAt = message.messageTimestamp
      ? new Date(Number(message.messageTimestamp) * 1000).toISOString()
      : new Date().toISOString();

    if (message.key.fromMe) {
      const storedId = await storeMessage({
        conversationId: conversation.id,
        waMessageId,
        direction: "outbound",
        senderType: "agent",
        messageType: getMessageType(text),
        body: text,
        normalizedText: normalizeText(text),
        sentAt,
        deliveryStatus: "sent",
        rawPayload: JSON.parse(JSON.stringify(message)),
      });
      await pauseConversation(conversation.id, config.autoPauseMinutes, "human_reply_detected");
      await storeIntentEvent({
        messageId: storedId,
        detectedIntent: null,
        confidence: "none",
        autoReplied: false,
        handoffTrigger: "human_reply_detected",
      });
      return;
    }

    const storedId = await storeMessage({
      conversationId: conversation.id,
      waMessageId,
      direction: "inbound",
      senderType: "guest",
      messageType: getMessageType(text),
      body: text,
      normalizedText: normalizeText(text),
      sentAt,
      deliveryStatus: "received",
      rawPayload: JSON.parse(JSON.stringify(message)),
    });

    if (!config.autoReplyEnabled) {
      await storeIntentEvent({
        messageId: storedId,
        detectedIntent: null,
        confidence: "none",
        autoReplied: false,
        handoffTrigger: "automation_disabled",
      });
      return;
    }

    const latestConversation = await getConversation(conversation.id);
    const pausedUntil = latestConversation?.bot_paused_until
      ? new Date(latestConversation.bot_paused_until).getTime()
      : null;
    if (latestConversation?.status === "handoff" && pausedUntil && pausedUntil > Date.now()) {
      await storeIntentEvent({
        messageId: storedId,
        detectedIntent: null,
        confidence: "none",
        autoReplied: false,
        handoffTrigger: "conversation_paused",
      });
      return;
    }

    const ruleset = loadRuleset();
    const recentGuestContext = await getRecentGuestContext(conversation.id);
    const botTurns = await countRecentBotTurns(conversation.id);
    const decision = await buildAutomationDecision({
      text,
      recentGuestContext,
      ruleset,
      botTurns,
    });

    if (!decision.shouldReply || !decision.replyText) {
      await storeIntentEvent({
        messageId: storedId,
        detectedIntent: decision.intentId,
        confidence: decision.confidence,
        autoReplied: false,
        handoffTrigger: decision.handoffReason,
      });
      return;
    }

    await this.sendTextMessage({
      phone: contact.phone,
      body: decision.replyText,
      senderType: "bot",
      conversationId: conversation.id,
    });

    await storeIntentEvent({
      messageId: storedId,
      detectedIntent: decision.intentId,
      confidence: decision.confidence,
      autoReplied: true,
      handoffTrigger: decision.handoffReason,
    });

    if (decision.shouldHandoff) {
      await pauseConversation(
        conversation.id,
        config.autoPauseMinutes,
        decision.handoffReason || "handoff_requested",
      );
    }
  }

  async sendTextMessage(input: {
    phone?: string;
    conversationId?: string;
    body: string;
    senderType: SenderType;
  }): Promise<{ messageId: string }> {
    if (!this.sock || !this.isConnected) {
      throw new Error("WhatsApp socket is not connected");
    }

    const phone =
      input.phone ||
      (input.conversationId ? await getConversationContactPhone(input.conversationId) : null);
    if (!phone) {
      throw new Error("Phone number is required");
    }

    const contact = await upsertContact(phone, null);
    const conversation = input.conversationId
      ? await getConversation(input.conversationId)
      : await getOrCreateConversation(contact.id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const result = await this.sock.sendMessage(jidFromPhone(phone), {
      text: input.body,
    });
    const messageId = result?.key?.id || `${normalizePhone(phone)}-${Date.now()}`;

    await storeMessage({
      conversationId: conversation.id,
      waMessageId: messageId,
      direction: "outbound",
      senderType: input.senderType,
      messageType: getMessageType(input.body),
      body: input.body,
      normalizedText: normalizeText(input.body),
      sentAt: new Date().toISOString(),
      deliveryStatus: "sent",
      rawPayload: JSON.parse(JSON.stringify(result)),
    });

    if (input.senderType === "agent") {
      await pauseConversation(conversation.id, config.autoPauseMinutes, "manual_agent_send");
    }

    return { messageId };
  }

  async pauseAutomation(conversationId: string, minutes: number, reason: string): Promise<void> {
    await pauseConversation(conversationId, minutes, reason);
  }

  async resumeAutomation(conversationId: string): Promise<void> {
    await resumeConversation(conversationId);
  }

  async attachContactToBooking(contactId: string, bookingId: string): Promise<void> {
    await linkContactToBooking(contactId, bookingId);
  }

  getHealth(): GatewayHealth {
    return {
      connected: this.isConnected,
      accountPhone: config.jvtoNumber,
      connectionStatus: this.connectionStatus,
      lastSeen: this.lastSeen,
      lastQrAt: this.lastQrAt,
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      autoReplyEnabled: config.autoReplyEnabled,
    };
  }

  getQrPayload(): { qr: string | null; qrDataUrl: string | null; generatedAt: string | null } {
    return {
      qr: this.lastQrText,
      qrDataUrl: this.lastQrDataUrl,
      generatedAt: this.lastQrAt,
    };
  }
}
