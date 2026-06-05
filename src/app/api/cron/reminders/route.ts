import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  const in73h = new Date(now.getTime() + 73 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      date: { gte: in72h, lte: in73h }
    },
    include: {
      guide: { select: { displayName: true, phone: true, city: true } },
      tourist: { select: { name: true, email: true } }
    }
  });

  const results = [];

  for (const booking of bookings) {
    const bookingRef = booking.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || booking.id.slice(-8).toUpperCase();
    const waClient = booking.notes?.match(/WA:([+0-9]+)/)?.[1];
    const dateStr = new Date(booking.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

    if (booking.guide?.phone) {
      results.push({ type: "guide", phone: booking.guide.phone, ref: bookingRef, date: dateStr });
    }
    if (waClient) {
      results.push({ type: "client", phone: waClient, ref: bookingRef, date: dateStr });
    }
  }

  return NextResponse.json({ processed: bookings.length, reminders: results.length, results });
}
