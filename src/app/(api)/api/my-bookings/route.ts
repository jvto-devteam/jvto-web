import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        customer: {
          email: session.user.email,
          deleted_at: null,
        },
        deleted_at: null,
      },
      include: {
        customer: { select: { name: true, email: true } },
        packages: {
          select: {
            name: true,
            durations: { select: { day: true, night: true } },
            package_assets: {
              where: { is_primary: true },
              include: { asset: { select: { url: true, description: true } } },
              take: 1,
            },
          },
        },
      },
      orderBy: { start_date: "desc" },
    });

    const result = bookings.map((b) => {
      const pkg = b.packages;
      const dur = pkg?.durations;
      const primaryAsset = pkg?.package_assets?.[0]?.asset;
      const fallbackAsset = !primaryAsset
        ? b.packages?.package_assets?.[0]?.asset
        : null;
      const banner = primaryAsset?.url ?? fallbackAsset?.url ?? "/assets/img/placeholder.jpg";

      return {
        id: Number(b.id),
        booking_code: b.booking_code ?? "",
        url: b.slug ?? String(b.id),
        customer_name: b.customer?.name ?? session.user?.name ?? "",
        package_name: pkg?.name ?? "JVTO Tour",
        duration: dur ? `${dur.day}D${dur.night}N` : "",
        travel_date_start: b.start_date.toISOString(),
        travel_date_end: b.end_date.toISOString(),
        total_pax: b.total_participants,
        status: b.booking_status,
        banner,
      };
    });

    const body = JSON.stringify(result, (_k, v) =>
      typeof v === "bigint" ? v.toString() : v,
    );

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[my-bookings] DB error:", message);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}
