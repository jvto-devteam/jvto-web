// app/api/routes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const routes = await prisma.routes.findMany({
      orderBy: { id: "asc" },
      include: {
        route_details: {
          orderBy: { seq: "asc" },
        },
        route_destinations: {
          orderBy: { sequence: "asc" },
          include: {
            destination: true,
          },
        },
      },
    });

    const payload = routes.map((r) => ({
      id: Number(r.id),
      code: r.code,
      route: r.route,
      itinerary_title: r.itinerary_title,
      start_area: r.start_area,
      end_area: r.end_area,
      estimated_duration: r.estimated_duration,
      main_activities: r.main_activities,
      accommodation_status: r.accommodation_status,
      customer_tips: r.customer_tips,
      overview: r.overview,
      breakfast: !!r.breakfast,
      lunch: !!r.lunch,
      dinner: !!r.dinner,
      route_details: r.route_details.map((d) => ({
        id: Number(d.id),
        seq: d.seq,
        time_or_label: d.time_or_label,
        activity: d.activity,
      })),
      // 🔴 BARU: destinasi yang dilewati route ini
      destinations: r.route_destinations.map((rd) => ({
        id: Number(rd.id),
        destination_id: Number(rd.destination_id),
        name: rd.destination?.name ?? "",
        sequence: rd.sequence,
      })),
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    console.error("GET /api/routes error:", err);
    return NextResponse.json(
      { message: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}
