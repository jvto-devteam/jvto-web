// @ts-nocheck
// lib/remark/remarkAutoLink.ts
//
// Remark plugin yang mengubah plain-text URL, nomor WA, email, dan internal path
// menjadi link — tanpa perlu ubah SQL sama sekali.
//
// Pola yang di-handle:
//   1. URL eksternal   → https://... atau http://...
//   2. Nomor WhatsApp  → +6282244788833 atau 6282244788833 → wa.me/...
//   3. Email           → hello@javavolcano-touroperator.com → mailto:...
//   4. Path internal   → /policy/*, /travel-guide/*, /why-jvto/*, dll
//
// Urutan match di regex PENTING:
//   - URL eksternal dulu (agar https://wa.me/... tidak double-match)
//   - Nomor WA sebelum path internal (agar +62... tidak salah match)
//   - Email sebelum path internal
//   - Path internal terakhir

import { visit, SKIP } from "unist-util-visit";
import type { Root, Text, Link, PhrasingContent } from "mdast";
import type { Plugin } from "unified";

// ─── Regex ────────────────────────────────────────────────────────────────────
//
// Grup 1 (external)  : https?://...
// Grup 2 (whatsapp)  : +62xxxxxxxxxx atau 62xxxxxxxxxx (min 10 digit setelah kode negara)
// Grup 3 (email)     : user@domain.tld
// Grup 4 (internal)  : /policy/... | /travel-guide/... | dll

const AUTOLINK_RE =
  /(https?:\/\/[^\s)\]'">,]+)|(\+?62\d{9,13})|([\w.+-]+@[\w-]+\.[\w.]{2,})|(\/(policy|travel-guide|why-jvto|verify-jvto|isic|tours|destinations|contact)(?:\/[^\s)\]'">,]*)?)/g;

// ─── Normalise nomor WA → strip semua non-digit, pastikan diawali 62 ──────────

function toWaHref(raw: string): string {
  const digits = raw.replace(/\D/g, ""); // hapus +, spasi, strip
  // Jika diawali 0, ganti jadi 62 (nomor lokal)
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}`;
}

// ─── Helper: teks → array node mdast ─────────────────────────────────────────

function textToNodes(raw: string): PhrasingContent[] {
  const nodes: PhrasingContent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  AUTOLINK_RE.lastIndex = 0;

  while ((match = AUTOLINK_RE.exec(raw)) !== null) {
    const [full, external, whatsapp, email, internal] = match;
    const start = match.index;

    // Teks sebelum match
    if (start > lastIndex) {
      nodes.push({ type: "text", value: raw.slice(lastIndex, start) });
    }

    // Tentukan href berdasarkan grup mana yang match
    let href: string;
    if (external) {
      href = external;
    } else if (whatsapp) {
      href = toWaHref(whatsapp);
    } else if (email) {
      href = `mailto:${email}`;
    } else {
      href = internal; // path internal, dipakai as-is
    }

    const linkNode: Link = {
      type: "link",
      url: href,
      children: [{ type: "text", value: full }],
    };
    nodes.push(linkNode);

    lastIndex = start + full.length;
  }

  // Sisa teks setelah match terakhir
  if (lastIndex < raw.length) {
    nodes.push({ type: "text", value: raw.slice(lastIndex) });
  }

  // Tidak ada match sama sekali → kembalikan node asli
  if (nodes.length === 0) {
    nodes.push({ type: "text", value: raw });
  }

  return nodes;
}

// ─── Plugin utama ─────────────────────────────────────────────────────────────

export const remarkAutoLink: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "text", (node: Text, index, parent) => {
      // Jangan proses node yang sudah di dalam link, code, atau html
      if (
        !parent ||
        index === undefined ||
        parent.type === "link" ||
        parent.type === "code" ||
        parent.type === "inlineCode" ||
        parent.type === "html"
      ) {
        return SKIP;
      }

      // Quick-check sebelum run regex penuh
      if (!AUTOLINK_RE.test(node.value)) {
        AUTOLINK_RE.lastIndex = 0;
        return;
      }
      AUTOLINK_RE.lastIndex = 0;

      const newNodes = textToNodes(node.value);

      // Tidak ada perubahan → skip
      if (newNodes.length === 1 && newNodes[0].type === "text") return;

      // Ganti text node dengan array node baru (text + link + text + ...)
      (parent.children as PhrasingContent[]).splice(index, 1, ...newNodes);

      // Lanjut dari posisi setelah node-node baru
      return index + newNodes.length;
    });
  };
};
