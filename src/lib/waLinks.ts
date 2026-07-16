export const WA_BASE = "https://wa.me/6282244788833";
export const WA_PHONE = "+62 822-4478-8833";

export const WA_LINKS = {
  general: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'd like to ask about your private volcano tours in East Java."
  )}`,
  fromSurabaya: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'm interested in a private tour from Surabaya. Can you share availability and pricing?"
  )}`,
  fromBali: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I'm interested in a private tour from Bali. Can you share availability and pricing?"
  )}`,
  trustInquiry: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO (founded by Tourist Police officer, NIB 1102230032918), I'd like to learn more about your tours and credentials."
  )}`,
  ijenHealthScreening: `${WA_BASE}?text=${encodeURIComponent(
    "Hi JVTO, I have questions about the Ijen health screening process before booking."
  )}`,
} as const;
