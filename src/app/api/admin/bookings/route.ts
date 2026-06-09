import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const period = url.searchParams.get("period") || "";
  const guideId = url.searchParams.get("guideId") || "";

  let dateFilter = {};
  if (period === "week") {
    const d = new Date(); d.setDate(d.getDate() - 7);
    dateFilter = { createdAt: { gte: d } };
  } else if (period === "month") {
    const d = new Date(); d.setDate(d.getDate() - 30);
    dateFilter = { createdAt: { gte: d } };
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    where: {
      AND: [
        status ? { status: status as any } : {},
        guideId ? { guideId } : {},
        dateFilter,
        search ? {
          OR: [
            { notes: { contains: search, mode: "insensitive" } },
            { guide: { displayName: { contains: search, mode: "insensitive" } } },
            { tourist: { name: { contains: search, mode: "insensitive" } } },
            { tourist: { email: { contains: search, mode: "insensitive" } } },
          ]
        } : {}
      ]
    },
    include: {
      guide: { select: { id: true, displayName: true, city: true, avatar: true, phone: true } },
      tourist: { select: { id: true, name: true, email: true, avatar: true } },
      slots: { include: { template: { select: { title: true } } } }
    }
  });

  const enriched = bookings.map(b => ({
    ...b,
    bookingRef: b.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || "LAK-" + b.id.slice(-8).toUpperCase(),
    whatsapp: b.notes?.match(/WA:([+0-9]+)/)?.[1] || null,
  }));

  return NextResponse.json({ bookings: enriched });
}
