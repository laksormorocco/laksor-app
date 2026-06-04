export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guideId, supabaseId, date, duration, persons, totalPrice, notes, paymentMethod, startTime, transport } = body;

    if (!guideId || !supabaseId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

    const guide = await prisma.guideProfile.findUnique({ where: { id: guideId } });
    if (!guide) return NextResponse.json({ error: "Guide introuvable" }, { status: 404 });

    const tourist = await prisma.user.findUnique({ where: { supabaseId } });
    if (!tourist) return NextResponse.json({ error: "Touriste introuvable" }, { status: 404 });

    const price = duration === "FULL_DAY" ? Number(guide.fullDayPrice) : Number(guide.halfDayPrice);
    const commission = Math.round(price * 0.25);

    const booking = await prisma.booking.create({
      data: {
        guideId,
        touristId: tourist.id,
        date: new Date(date),
        duration: duration === "FULL_DAY" ? "FULL_DAY" : "HALF_DAY",
        persons: parseInt(persons) || 1,
        totalPrice: totalPrice || price,
        commission,
        status: "CONFIRMED",
        notes: notes || "",
        slots: {
          create: [{
            date: new Date(date),
            duration: duration === "FULL_DAY" ? "full" : "half",
            price,
          }]
        }
      }
    });

    const isPaid = paymentMethod === "deposit" || paymentMethod === "full";

    let whatsappUrl = null;
    if (guide.phone) {
      const phone = guide.phone.replace(/[^0-9]/g, "");
      const dateStr = new Date(date).toLocaleDateString("fr-FR");
      const duree = duration === "FULL_DAY" ? "Journée complète (8h)" : "Demi-journée (4h)";

      const msg = encodeURIComponent(
        `✅ Nouvelle réservation confirmée!

` +
        `👤 Touriste: ${tourist.name || tourist.email}
` +
        `📅 Date: ${dateStr}
` +
        `⏱ Durée: ${duree}
` +
        (startTime ? `🕐 Heure souhaitée: ${startTime}
` : "") +
        (transport ? `🚗 Transport aller-retour hôtel/riad: +300 MAD
` : "") +
        `👥 Personnes: ${persons}
` +
        `💰 Prix total: ${totalPrice || price} MAD
` +
        `💳 Paiement: ${paymentMethod === "deposit" ? "Acompte 30%" : paymentMethod === "full" ? "100% en ligne" : "Cash le jour J"}
` +
        (isPaid
          ? `
📞 Contact touriste: ${tourist.email}
` +
            `
🍵 Offrez un thé de bienvenu à votre touriste chez un café partenaire Laksor — Laksor vous rembourse.
`
          : `
⚠️ Paiement cash — contactez le touriste 72h avant la visite via votre dashboard.
`
        ) +
        `
🔗 Dashboard: https://laksor.vercel.app/dashboard/guide?id=${guideId}`
      );
      whatsappUrl = `https://wa.me/${phone}?text=${msg}`;
    }

    return NextResponse.json({ booking, whatsappUrl });
  } catch(e: any) {
    console.error("Booking error:", e);
    return NextResponse.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
