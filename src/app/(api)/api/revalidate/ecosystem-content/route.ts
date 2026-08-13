import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateRequestBody = {
  route?: string;
  routes?: string[];
};

function normalizePath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.includes("://")) return null;
  return trimmed.length > 1 && trimmed.endsWith("/")
    ? trimmed.slice(0, -1)
    : trimmed;
}

function isAuthorized(request: NextRequest): boolean {
  const secret =
    process.env.ECOSYSTEM_REVALIDATE_SECRET ?? process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: RevalidateRequestBody = {};
  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch {
    body = {};
  }

  const requestedRoutes = [
    normalizePath(body.route),
    ...(Array.isArray(body.routes) ? body.routes.map(normalizePath) : []),
  ].filter((route): route is string => Boolean(route));

  const routes = Array.from(new Set(requestedRoutes));

  revalidateTag("jvto-ekosistem-content", "max");
  for (const route of routes) {
    revalidatePath(route);
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      tag: "jvto-ekosistem-content",
      routes,
    },
  });
}
