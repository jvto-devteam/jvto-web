export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith("62")) {
    return digits;
  }
  return digits;
}

export function jidFromPhone(input: string): string {
  return `${normalizePhone(input)}@s.whatsapp.net`;
}

export function phoneFromJid(jid: string): string {
  return jid.split("@")[0] ?? "";
}
