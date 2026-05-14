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

    let whatsappUrl = null;
    if (guide.phone) {
      const phone = guide.phone.replace(/[^0-9]/g, "");
      const date = new Date(slots[0].date).toLocaleDateString("fr-FR");
      const duree = slots[0].duration === "half" ? "Demi-journee (4h)" : "Journee complete (8h)";
      const msg = encodeURIComponent(
        "🧭 Nouvelle reservation Laksor !\n\n" +
        "Date: " + date + "\n" +
        "Duree: " + duree + "\n" +
        "Personnes: " + persons + "\n" +
        "Prix total: " + total + " MAD\n\n" +
        "Accepter ou refuser sur:\n" +
        "https://laksor.vercel.app/dashboard/guide?id=" + guideId
      );
      whatsappUrl = "https://wa.me/" + phone + "?text=" + msg;
    }

    return NextResponse.json({ booking, whatsappUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
