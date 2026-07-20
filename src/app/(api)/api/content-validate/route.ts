// src/app/(api)/api/content-validate/route.ts
// Admin-only draft facts-lock gate. POST { text } → runs the SAME denylist as
// CI + the facts-locked-web skill by spawning scripts/validate-content-drift.mjs
// --stdin (no re-implementation of the regex rules). Exit 0 → { ok:true };
// exit 1 → { ok:false, violations: [<lines starting with '✗'>] }.
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { requireAdmin } from "@/lib/auth";

// Must run in the Node runtime — spawns a child process + reads the repo script.
export const runtime = "nodejs";

function runValidator(
  text: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(
        "node",
        ["scripts/validate-content-drift.mjs", "--stdin"],
        { cwd: process.cwd() },
      );
    } catch (err) {
      reject(err);
      return;
    }

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    child.stdin.on("error", () => {
      /* ignore EPIPE if the child exits before we finish writing */
    });
    child.stdin.write(text);
    child.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: "unauthorized" },
      { status: auth.status },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text : "";

    const { code, stdout } = await runValidator(text);

    if (code === 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Non-zero → parse the '✗'-prefixed violation lines from stdout.
    const violations = stdout
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.startsWith("✗"));

    return NextResponse.json({ ok: false, violations }, { status: 200 });
  } catch (error) {
    console.error("POST /api/content-validate error:", error);
    return NextResponse.json(
      { message: "Failed to run content validator (server error)" },
      { status: 500 },
    );
  }
}
