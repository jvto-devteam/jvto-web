"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappGateway = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const engine_1 = require("../automation/engine");
const templates_1 = require("../automation/templates");
const config_1 = require("../config");
const repository_1 = require("../db/repository");
const logger_1 = require("../logger");
const phone_1 = require("../utils/phone");
function extractText(message) {
    if (!message)
        return "";
    if (message.conversation)
        return message.conversation;
    if (message.extendedTextMessage?.text)
        return message.extendedTextMessage.text;
    if (message.imageMessage?.caption)
        return message.imageMessage.caption;
    if (message.videoMessage?.caption)
        return message.videoMessage.caption;
    if (message.buttonsResponseMessage?.selectedDisplayText) {
        return message.buttonsResponseMessage.selectedDisplayText;
    }
    if (message.listResponseMessage?.title)
        return message.listResponseMessage.title;
    if (message.ephemeralMessage?.message)
        return extractText(message.ephemeralMessage.message);
    if (message.viewOnceMessage?.message)
        return extractText(message.viewOnceMessage.message);
    return "";
}
function normalizeText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
}
function getMessageType(text) {
    return /https?:\/\//i.test(text) ? "link" : "text";
}
class WhatsappGateway {
    sock = null;
    reconnectDelayMs = 2000;
    startedAt = Date.now();
    connectionStatus = "booting";
    isConnected = false;
    lastSeen = null;
    lastQrText = null;
    lastQrDataUrl = null;
    lastQrAt = null;
    lastError = null;
    async start() {
        fs_1.default.mkdirSync(config_1.config.sessionDir, { recursive: true });
        const ruleset = (0, templates_1.loadRuleset)();
        await (0, repository_1.seedQuickReplies)(ruleset.intents.map((intent, index) => ({
            slug: intent.id,
            intentId: intent.id,
            title: intent.id.replace(/_/g, " "),
            body: intent.reply_template,
            sortOrder: (index + 1) * 10,
        })));
        await this.connect();
    }
    async connect() {
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(config_1.config.sessionDir);
        const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
        this.sock = (0, baileys_1.default)({
            version,
            auth: state,
            browser: baileys_1.Browsers.ubuntu("JVTO WA Gateway"),
            markOnlineOnConnect: false,
            syncFullHistory: false,
        });
        this.sock.ev.on("creds.update", saveCreds);
        this.sock.ev.on("connection.update", async (update) => {
            if (update.qr) {
                this.lastQrText = update.qr;
                this.lastQrDataUrl = await qrcode_1.default.toDataURL(update.qr);
                this.lastQrAt = new Date().toISOString();
            }
            if (update.connection === "open") {
                this.connectionStatus = "open";
                this.isConnected = true;
                this.lastSeen = new Date().toISOString();
                this.reconnectDelayMs = 2000;
                this.lastError = null;
                await (0, repository_1.upsertAccount)({
                    accountPhone: config_1.config.jvtoNumber,
                    connectionStatus: this.connectionStatus,
                    isConnected: true,
                    pairedDevice: { user: this.sock?.user ?? null },
                    qrText: this.lastQrText,
                });
                await (0, repository_1.logGatewayEvent)("connection", "info", "WhatsApp connection opened");
                logger_1.logger.info("WhatsApp connection opened");
            }
            if (update.connection === "close") {
                this.connectionStatus = "closed";
                this.isConnected = false;
                const statusCode = update.lastDisconnect?.error?.output?.statusCode;
                this.lastError = update.lastDisconnect?.error?.message ?? null;
                await (0, repository_1.upsertAccount)({
                    accountPhone: config_1.config.jvtoNumber,
                    connectionStatus: statusCode === baileys_1.DisconnectReason.loggedOut ? "logged_out" : "closed",
                    isConnected: false,
                    pairedDevice: { user: this.sock?.user ?? null },
                    qrText: this.lastQrText,
                    lastError: this.lastError,
                });
                await (0, repository_1.logGatewayEvent)("connection", "warn", "WhatsApp connection closed", {
                    statusCode,
                    lastError: this.lastError,
                });
                logger_1.logger.warn({ statusCode, lastError: this.lastError }, "WhatsApp connection closed");
                if (statusCode !== baileys_1.DisconnectReason.loggedOut) {
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
                }
                catch (error) {
                    logger_1.logger.error({ error }, "Failed to handle WhatsApp message");
                    await (0, repository_1.logGatewayEvent)("message_processing", "error", "Failed to handle message", {
                        error: String(error),
                    });
                }
            }
        });
    }
    async handleMessage(message) {
        const remoteJid = message.key.remoteJid;
        if (!remoteJid || remoteJid === "status@broadcast" || remoteJid.endsWith("@g.us")) {
            return;
        }
        const waMessageId = message.key.id;
        if (!waMessageId || (await (0, repository_1.hasStoredMessage)(waMessageId))) {
            return;
        }
        const phone = (0, phone_1.phoneFromJid)(remoteJid);
        const text = extractText(message.message);
        if (!text.trim()) {
            return;
        }
        const displayName = message.pushName || (message.key.fromMe ? "JVTO Operator" : null);
        const contact = await (0, repository_1.upsertContact)(phone, displayName);
        const conversation = await (0, repository_1.getOrCreateConversation)(contact.id);
        const sentAt = message.messageTimestamp
            ? new Date(Number(message.messageTimestamp) * 1000).toISOString()
            : new Date().toISOString();
        if (message.key.fromMe) {
            const storedId = await (0, repository_1.storeMessage)({
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
            await (0, repository_1.pauseConversation)(conversation.id, config_1.config.autoPauseMinutes, "human_reply_detected");
            await (0, repository_1.storeIntentEvent)({
                messageId: storedId,
                detectedIntent: null,
                confidence: "none",
                autoReplied: false,
                handoffTrigger: "human_reply_detected",
            });
            return;
        }
        const storedId = await (0, repository_1.storeMessage)({
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
        if (!config_1.config.autoReplyEnabled) {
            await (0, repository_1.storeIntentEvent)({
                messageId: storedId,
                detectedIntent: null,
                confidence: "none",
                autoReplied: false,
                handoffTrigger: "automation_disabled",
            });
            return;
        }
        const latestConversation = await (0, repository_1.getConversation)(conversation.id);
        const pausedUntil = latestConversation?.bot_paused_until
            ? new Date(latestConversation.bot_paused_until).getTime()
            : null;
        if (latestConversation?.status === "handoff" && pausedUntil && pausedUntil > Date.now()) {
            await (0, repository_1.storeIntentEvent)({
                messageId: storedId,
                detectedIntent: null,
                confidence: "none",
                autoReplied: false,
                handoffTrigger: "conversation_paused",
            });
            return;
        }
        const ruleset = (0, templates_1.loadRuleset)();
        const recentGuestContext = await (0, repository_1.getRecentGuestContext)(conversation.id);
        const botTurns = await (0, repository_1.countRecentBotTurns)(conversation.id);
        const decision = await (0, engine_1.buildAutomationDecision)({
            text,
            recentGuestContext,
            ruleset,
            botTurns,
        });
        if (!decision.shouldReply || !decision.replyText) {
            await (0, repository_1.storeIntentEvent)({
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
        await (0, repository_1.storeIntentEvent)({
            messageId: storedId,
            detectedIntent: decision.intentId,
            confidence: decision.confidence,
            autoReplied: true,
            handoffTrigger: decision.handoffReason,
        });
        if (decision.shouldHandoff) {
            await (0, repository_1.pauseConversation)(conversation.id, config_1.config.autoPauseMinutes, decision.handoffReason || "handoff_requested");
        }
    }
    async sendTextMessage(input) {
        if (!this.sock || !this.isConnected) {
            throw new Error("WhatsApp socket is not connected");
        }
        const phone = input.phone ||
            (input.conversationId ? await (0, repository_1.getConversationContactPhone)(input.conversationId) : null);
        if (!phone) {
            throw new Error("Phone number is required");
        }
        const contact = await (0, repository_1.upsertContact)(phone, null);
        const conversation = input.conversationId
            ? await (0, repository_1.getConversation)(input.conversationId)
            : await (0, repository_1.getOrCreateConversation)(contact.id);
        if (!conversation) {
            throw new Error("Conversation not found");
        }
        const result = await this.sock.sendMessage((0, phone_1.jidFromPhone)(phone), {
            text: input.body,
        });
        const messageId = result?.key?.id || `${(0, phone_1.normalizePhone)(phone)}-${Date.now()}`;
        await (0, repository_1.storeMessage)({
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
            await (0, repository_1.pauseConversation)(conversation.id, config_1.config.autoPauseMinutes, "manual_agent_send");
        }
        return { messageId };
    }
    async pauseAutomation(conversationId, minutes, reason) {
        await (0, repository_1.pauseConversation)(conversationId, minutes, reason);
    }
    async resumeAutomation(conversationId) {
        await (0, repository_1.resumeConversation)(conversationId);
    }
    async attachContactToBooking(contactId, bookingId) {
        await (0, repository_1.linkContactToBooking)(contactId, bookingId);
    }
    getHealth() {
        return {
            connected: this.isConnected,
            accountPhone: config_1.config.jvtoNumber,
            connectionStatus: this.connectionStatus,
            lastSeen: this.lastSeen,
            lastQrAt: this.lastQrAt,
            uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
            autoReplyEnabled: config_1.config.autoReplyEnabled,
        };
    }
    getQrPayload() {
        return {
            qr: this.lastQrText,
            qrDataUrl: this.lastQrDataUrl,
            generatedAt: this.lastQrAt,
        };
    }
}
exports.WhatsappGateway = WhatsappGateway;
