export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { guideId, slots, persons, total, commission } = await req.json();

    const guide = await prisma.guideProfile.findUnique({ where: { id: guideId } });
    if (!guide) return NextResponse.json({ error: "Guide introuvable" }, { status: 404 });

    const booking = await prisma.booking.create({
      data: {
        guideId,
        touristId: guide.userId,
        date: new Date(slots[0].date),
        duration: slots[0].duration === "half" ? "HALF_DAY" : "FULL_DAY",
        persons,
        totalPrice: total,
        commission,
        status: "PENDING",
        slots: {
          create: slots.map((s: { date: string; duration: string }) => ({
            date: new Date(s.date),
            duration: s.duration,
            price: s.duration === "half" ? guide.halfDayPrice : guide.fullDayPrice,
          })),
        },
      },
    });

    return NextResponse.json({ booking });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
