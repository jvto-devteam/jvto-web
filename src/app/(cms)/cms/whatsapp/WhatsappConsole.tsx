"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type {
  ConversationAdminRow,
  GatewayStatus,
  MessageAdminRow,
  QuickReplyRow,
} from "@/lib/whatsapp/admin";

type Props = {
  initialGatewayStatus: GatewayStatus | null;
  initialQuickReplies: QuickReplyRow[];
  handoffs: ConversationAdminRow[];
  conversations: ConversationAdminRow[];
  messages: MessageAdminRow[];
};

type QrPayload = {
  qr: string | null;
  qrDataUrl: string | null;
  generatedAt: string | null;
};

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}

export default function WhatsappConsole({
  initialGatewayStatus,
  initialQuickReplies,
  handoffs,
  conversations,
  messages,
}: Props) {
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus | null>(initialGatewayStatus);
  const [qrPayload, setQrPayload] = useState<QrPayload | null>(null);
  const [quickReplies, setQuickReplies] = useState(initialQuickReplies);
  const [notice, setNotice] = useState<string>("");
  const [sendForm, setSendForm] = useState({
    phone: "",
    conversationId: "",
    body: "",
  });
  const [linkForm, setLinkForm] = useState({
    contactId: "",
    bookingId: "",
  });
  const [isPending, startTransition] = useTransition();
  const initialQrRefreshDone = useRef(false);

  const refreshGatewayStatus = useCallback(async () => {
    const [statusRes, qrRes] = await Promise.all([
      fetch("/api/whatsapp/session/status", { cache: "no-store" }),
      fetch("/api/whatsapp/session/qr", { cache: "no-store" }),
    ]);
    if (statusRes.ok) {
      setGatewayStatus((await statusRes.json()) as GatewayStatus);
    }
    if (qrRes.ok) {
      setQrPayload((await qrRes.json()) as QrPayload);
    }
  }, []);

  useEffect(() => {
    if (initialQrRefreshDone.current) {
      return;
    }
    if (!gatewayStatus?.connected) {
      initialQrRefreshDone.current = true;
      const timeout = window.setTimeout(() => {
        void refreshGatewayStatus();
      }, 0);
      return () => window.clearTimeout(timeout);
    }
  }, [gatewayStatus?.connected, refreshGatewayStatus]);

  async function handleSendMessage() {
    await postJson("/api/whatsapp/messages/send", {
      phone: sendForm.phone || undefined,
      conversationId: sendForm.conversationId || undefined,
      body: sendForm.body,
      senderType: "agent",
    });
    setNotice("Manual WhatsApp message sent.");
    setSendForm({ phone: "", conversationId: "", body: "" });
  }

  async function handlePause(conversationId: string) {
    await postJson("/api/whatsapp/automation/pause", {
      conversationId,
      minutes: 180,
      reason: "manual_pause_from_cms",
    });
    setNotice(`Automation paused for conversation ${conversationId}.`);
  }

  async function handleResume(conversationId: string) {
    await postJson("/api/whatsapp/automation/resume", { conversationId });
    setNotice(`Automation resumed for conversation ${conversationId}.`);
  }

  async function handleLinkBooking() {
    await postJson("/api/whatsapp/contacts/link-booking", linkForm);
    setNotice("Contact linked to booking.");
    setLinkForm({ contactId: "", bookingId: "" });
  }

  async function handleSaveQuickReply(reply: QuickReplyRow) {
    const saved = (await postJson("/api/whatsapp/quick-replies", {
      slug: reply.slug,
      intentId: reply.intent_id,
      title: reply.title,
      body: reply.body,
      isActive: reply.is_active,
      sortOrder: reply.sort_order,
    })) as QuickReplyRow;

    setQuickReplies((current) =>
      current.map((item) => (item.slug === saved.slug ? saved : item)),
    );
    setNotice(`Quick reply "${saved.slug}" saved.`);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">WhatsApp Operations</h2>
          <p className="text-sm text-slate-400">
            Gateway status, pairing QR, handoff queue, quick replies, and manual actions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => startTransition(() => void refreshGatewayStatus())}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
        >
          {isPending ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>

      {notice ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Gateway</div>
          <div className="mt-3 text-lg font-semibold text-slate-50">
            {gatewayStatus?.connected ? "Connected" : "Disconnected"}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Status: {gatewayStatus?.connectionStatus ?? "unknown"}
          </div>
          <div className="text-sm text-slate-400">
            Auto reply: {gatewayStatus?.autoReplyEnabled ? "on" : "off"}
          </div>
          <div className="text-sm text-slate-400">
            Last QR: {gatewayStatus?.lastQrAt ?? "not generated"}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Pairing QR</div>
              <div className="mt-1 text-sm text-slate-400">
                Scan this from the linked WhatsApp device when the gateway requires a new session.
              </div>
            </div>
            <button
              type="button"
              onClick={() => startTransition(() => void refreshGatewayStatus())}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
            >
              Load QR
            </button>
          </div>
          <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950">
            {qrPayload?.qrDataUrl ? (
              <Image
                src={qrPayload.qrDataUrl}
                alt="WhatsApp pairing QR"
                width={224}
                height={224}
                unoptimized
                className="h-56 w-56 rounded-lg bg-white p-3"
              />
            ) : (
              <p className="max-w-sm text-center text-sm text-slate-500">
                No QR is currently available. If the gateway is already paired, this is expected.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-50">Manual Send</h3>
          <div className="mt-4 grid gap-3">
            <input
              value={sendForm.phone}
              onChange={(event) =>
                setSendForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Phone number, e.g. 62812..."
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <input
              value={sendForm.conversationId}
              onChange={(event) =>
                setSendForm((current) => ({ ...current, conversationId: event.target.value }))
              }
              placeholder="Or existing conversation ID"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <textarea
              value={sendForm.body}
              onChange={(event) =>
                setSendForm((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="Write the outbound text or link..."
              className="min-h-[120px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <button
              type="button"
              onClick={() => startTransition(() => void handleSendMessage())}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
              disabled={isPending || !sendForm.body.trim()}
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-50">Link Contact to Booking</h3>
          <div className="mt-4 grid gap-3">
            <input
              value={linkForm.contactId}
              onChange={(event) =>
                setLinkForm((current) => ({ ...current, contactId: event.target.value }))
              }
              placeholder="Contact ID"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <input
              value={linkForm.bookingId}
              onChange={(event) =>
                setLinkForm((current) => ({ ...current, bookingId: event.target.value }))
              }
              placeholder="Booking ID"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <button
              type="button"
              onClick={() => startTransition(() => void handleLinkBooking())}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
              disabled={isPending || !linkForm.contactId || !linkForm.bookingId}
            >
              {isPending ? "Saving..." : "Link Booking"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold text-slate-50">Recent Handoff Queue</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Conversation</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {handoffs.map((item) => (
                <tr key={item.id} className="border-t border-slate-800">
                  <td className="py-3 font-mono text-xs">{item.id}</td>
                  <td className="py-3">{item.display_name || item.phone}</td>
                  <td className="py-3">{item.handoff_reason || "manual"}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => startTransition(() => void handleResume(item.id))}
                      className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
                    >
                      Resume Bot
                    </button>
                  </td>
                </tr>
              ))}
              {handoffs.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>
                    No handoff items.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold text-slate-50">Recent Conversations</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Conversation</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Linked Booking</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {conversations.map((item) => (
                <tr key={item.id} className="border-t border-slate-800">
                  <td className="py-3 font-mono text-xs">{item.id}</td>
                  <td className="py-3">
                    <div>{item.display_name || item.phone}</div>
                    <div className="text-xs text-slate-500">{item.phone}</div>
                  </td>
                  <td className="py-3">{item.status}</td>
                  <td className="py-3">{item.linked_booking_id || "-"}</td>
                  <td className="py-3">
                    {item.status === "handoff" ? (
                      <button
                        type="button"
                        onClick={() => startTransition(() => void handleResume(item.id))}
                        className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
                      >
                        Resume
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startTransition(() => void handlePause(item.id))}
                        className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
                      >
                        Pause
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold text-slate-50">Quick Replies</h3>
        <div className="mt-4 space-y-4">
          {quickReplies.map((reply) => (
            <div key={reply.slug} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-100">{reply.title}</div>
                  <div className="text-xs text-slate-500">
                    {reply.slug} / {reply.intent_id}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={reply.is_active}
                    onChange={(event) =>
                      setQuickReplies((current) =>
                        current.map((item) =>
                          item.slug === reply.slug
                            ? { ...item, is_active: event.target.checked }
                            : item,
                        ),
                      )
                    }
                  />
                  Active
                </label>
              </div>
              <textarea
                value={reply.body}
                onChange={(event) =>
                  setQuickReplies((current) =>
                    current.map((item) =>
                      item.slug === reply.slug ? { ...item, body: event.target.value } : item,
                    ),
                  )
                }
                className="mt-3 min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => startTransition(() => void handleSaveQuickReply(reply))}
                  className="rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-white"
                >
                  Save Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold text-slate-50">Message Log</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Direction</th>
                <th className="pb-3">Sender</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Message</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {messages.map((message) => (
                <tr key={message.id} className="border-t border-slate-800 align-top">
                  <td className="py-3 text-xs uppercase">{message.direction}</td>
                  <td className="py-3">{message.sender_type}</td>
                  <td className="py-3">{message.display_name || message.phone}</td>
                  <td className="py-3 max-w-xl whitespace-pre-wrap text-slate-300">
                    {message.body}
                  </td>
                  <td className="py-3 text-xs text-slate-500">{message.sent_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
