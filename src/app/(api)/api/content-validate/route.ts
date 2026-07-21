// src/app/(api)/api/content-validate/route.ts
// Admin-only draft facts-lock gate. POST { text } → runs the SAME denylist as CI +
// the facts-locked-web skill, imported directly from scripts/lib/contentDriftRules.mjs
// (no child process, no cwd dependency). Returns { ok:true } when clean, or
// { ok:false, violations:[...] } listing each forbidden hit.
//
// Why not spawn the CLI: the previous version ran `node scripts/validate-content-drift.mjs`
// with a RELATIVE path against process.cwd(). If the deployed service's cwd was not the
// repo root, spawn still "succeeded" (node resolves) but node exited 1 with the error on
// stderr and empty stdout — so the gate blocked EVERY publish with an empty violation
// list, indistinguishable from a real facts-lock hit. Importing the pure denylist removes
// that failure mode (a broken import is a build error, not a silent runtime block) and
// clears the Turbopack "can't resolve" warning.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { scanText } from "../../../../../scripts/lib/contentDriftRules.mjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text : "";

    const hits = scanText(text, "<draft>");

    if (hits.length === 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const violations = hits.map(
      (h) => `✗ ${h.rel}:${h.line} — ${h.rule} — ${h.text}`,
    );
    return NextResponse.json({ ok: false, violations }, { status: 200 });
  } catch (error) {
    console.error("POST /api/content-validate error:", error);
    return NextResponse.json(
      { message: "Failed to run content validator (server error)" },
      { status: 500 },
    );
  }
}
