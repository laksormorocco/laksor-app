import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { bookingId: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        guide: {
          select: {
            id: true, displayName: true, city: true,
            avatar: true, avgRating: true, totalReviews: true,
            languages: true, phone: true, halfDayPrice: true, fullDayPrice: true
          }
        },
        tourist: {
          select: { id: true, name: true, email: true }
        },
        slots: true,
      }
    });

    if (!booking) return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });

    // Extraire bookingRef depuis notes
    const refMatch = booking.notes?.match(/REF:([A-Z0-9-]+)/);
    const bookingRef = refMatch ? refMatch[1] : "LAK-" + booking.id.slice(-8).toUpperCase();

    return NextResponse.json({ booking, bookingRef });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
