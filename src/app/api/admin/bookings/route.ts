import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const city = url.searchParams.get("city") || "";

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    where: {
      AND: [
        status ? { status: status as any } : {},
        city ? { guide: { city } } : {},
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
      slots: true
    }
  });

  // Extraire bookingRef depuis notes
  const enriched = bookings.map(b => ({
    ...b,
    bookingRef: b.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || "LAK-" + b.id.slice(-8).toUpperCase(),
    whatsapp: b.notes?.match(/WA:([+0-9]+)/)?.[1] || null,
  }));

  return NextResponse.json({ bookings: enriched });
}
