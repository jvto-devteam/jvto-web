"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.jidFromPhone = jidFromPhone;
exports.phoneFromJid = phoneFromJid;
function normalizePhone(input) {
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
function jidFromPhone(input) {
    return `${normalizePhone(input)}@s.whatsapp.net`;
}
function phoneFromJid(jid) {
    return jid.split("@")[0] ?? "";
}
