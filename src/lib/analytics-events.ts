"use client";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type ContactEventName = "contact_whatsapp" | "contact_email";

type ContactEventPayload = {
  source: string;
  link_url: string;
  link_text?: string;
};

function pushContactEvent(name: ContactEventName, payload: ContactEventPayload) {
  if (typeof window === "undefined") return;

  const linkText = payload.link_text ?? "";

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: name,
      link_url: payload.link_url,
      link_text: linkText,
      [name === "contact_whatsapp" ? "wa_source" : "email_source"]: payload.source,
    });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, {
      event_category: "engagement",
      event_label: payload.source,
      link_url: payload.link_url,
      link_text: linkText,
    });
  }
}

export function pushWaEvent(source: string, link_url?: string, link_text?: string) {
  pushContactEvent("contact_whatsapp", {
    source,
    link_url: link_url ?? "",
    link_text,
  });
}

export function pushEmailEvent(source: string, link_url?: string, link_text?: string) {
  pushContactEvent("contact_email", {
    source,
    link_url: link_url ?? "",
    link_text,
  });
}