export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guideId, supabaseId, date, duration, persons, totalPrice, notes, paymentMethod, startTime, transport, guestName, guestContact, expId, tourType } = body;

    if (!guideId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

    const guide = await prisma.guideProfile.findUnique({ where: { id: guideId } });
    if (!guide) return NextResponse.json({ error: "Guide introuvable" }, { status: 404 });

    let tourist = supabaseId ? await prisma.user.findUnique({ where: { supabaseId } }) : null;
    if (!tourist) {
      const guestEmail = guestContact && guestContact.includes("@") ? guestContact : (guestName || "guest") + "@guest.laksor.ma";
      tourist = await prisma.user.upsert({
        where: { email: guestEmail },
        update: { name: guestName || "Guest" },
        create: { supabaseId: "guest_" + Date.now(), email: guestEmail, name: guestName || "Guest", role: "TOURIST" }
      });
    }

    // Generer numero de reservation unique
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingRef = "LAK-" + year + "-" + rand;

    const price = duration === "FULL_DAY" ? Number(guide.fullDayPrice) : Number(guide.halfDayPrice);
    const commission = Math.round(totalPrice * 0.2); // 20% du prix client = 25% du prix guide

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
    notes: (notes || "") + " | REF:" + bookingRef + (expId ? " | EXP:" + expId : "") + (tourType ? " | TYPE:" + tourType : "") + " | CLIENT:" + (guestName || "") + " | CONTACT:" + (guestContact || ""),
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

      const netPrice = Math.round((Number(totalPrice || price) - 25) / 1.25);
      const tourTypeLabel: Record<string,string> = {MEDINA_SECRETS:"Médina & Secrets",GASTRONOMIE:"Gastronomie",HISTOIRE_MONUMENTS:"Histoire & Monuments",DESERT_NATURE:"Désert & Nature",SHOPPING_ARTISANAT:"Shopping & Artisanat",COUCHER_SOLEIL:"Coucher de soleil",PHOTO_INSTAGRAM:"Photo Instagram"};
      const tourLabel = tourType ? (tourTypeLabel[tourType] || tourType) : (expId ? "Expérience Laksor" : "Visite guidée");
      const payLabel = paymentMethod === "deposit" ? "Acompte 30%" : paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";
      const teaLine = isPaid ? "\n\u{1F375} Offrez un the de bienvenu chez un cafe partenaire Laksor." : "\n Paiement cash - assurez-vous etre disponible.";
      const hourLine = startTime ? "\n Heure : " + startTime : "";
      const msg = encodeURIComponent(
        "Nouvelle reservation Laksor !\n\n" +
        "Touriste : " + (tourist.name || "Client") + "\n" +
        "Date : " + dateStr + hourLine + "\n" +
        "Participants : " + persons + " pers.\n" +
        "Type : " + tourLabel + "\n" +
        "Votre gain : " + netPrice + " MAD\n" +
        "Paiement : " + payLabel + "\n" +
        "Ref : " + bookingRef +
        teaLine +
        "\n\nBonne visite!\nDashboard : https://laksor.vercel.app/dashboard/guide?id=" + guideId
      );
      whatsappUrl = `https://wa.me/${phone}?text=${msg}`;

    // Message de remerciement WhatsApp au touriste
    if (guestContact && !guestContact.includes("@")) {
      const touristPhone = guestContact.replace(/[^0-9]/g, "");
      const touristMsg = encodeURIComponent(
        `🌟 Merci pour votre confiance, ${tourist.name || "cher(e) voyageur(se)"} !

Votre réservation Laksor est bien confirmée.
🔖 Réf : ${bookingRef}
📅 Date : ${dateStr}

Nous sommes disponibles pour vous aider à tout moment, n'hésitez pas à nous contacter via WhatsApp.

Notre équipe vous contactera 72h avant votre visite pour vous donner tous les détails.

À très bientôt au Maroc authentique ! 🇲🇦
— L'équipe Laksor
📱 https://wa.me/212657436342`
      );
      fetch(`https://wa.me/${touristPhone}?text=${touristMsg}`).catch(() => {});
    }

    // Notification WhatsApp prestataire si expérience provider
    if (expId) {
      try {
        const exp = await prisma.guideExperience.findUnique({
          where: { id: expId },
          include: { provider: true }
        });
        if (exp?.provider?.phone) {
          const provPhone = exp.provider.phone.replace(/[^0-9]/g, "");
          const provNetPrice = Math.round((Number(totalPrice || price) - 25) / 1.25);
          const provMsg = encodeURIComponent(
            `🌟 Nouvelle réservation Laksor !

👤 Touriste : ${tourist.name || "Client"}
📅 Date : ${dateStr}
${startTime ? `⏰ Heure : ${startTime}\n` : ""}👥 Participants : ${persons} pers.
🎯 Expérience : ${exp.title}
💰 Votre gain : ${provNetPrice} MAD
💳 Paiement : ${paymentMethod === "deposit" ? "Acompte 30%" : paymentMethod === "full" ? "100% en ligne" : "Cash le jour J"}
🔖 Réf : ${bookingRef}

Bonne expérience ! 🇲🇦
🔗 Dashboard : https://laksor.vercel.app/provider/dashboard`
          );
          await fetch(`https://wa.me/${provPhone}?text=${provMsg}`).catch(() => {});
        }
      } catch(e) {}
    }
    }

    // Envoyer email de confirmation
    const dateStr = new Date(date).toLocaleDateString("fr-FR");
    const duree = duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)";
    const emailTo = guestContact?.includes("@") ? guestContact : tourist.email;
    if (emailTo) {
      try {
        await fetch(process.env.NEXT_PUBLIC_APP_URL + "/api/email", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            to: emailTo,
            guideName: guide.displayName,
            date: dateStr,
            persons,
            price: totalPrice || price,
            duration: duree,
            paymentMethod,
            guestName: tourist.name || guestName || "Client",
            bookingId: booking.id
          })
        });
      } catch(emailErr) { console.error("Email error:", emailErr); }
    }

    // INVOICE DESACTIVE TEMPORAIREMENT
    /*
    const invoiceEmail = guestContact?.includes("@") ? guestContact : tourist.email;
    try {
      await fetch("https://laksor.vercel.app/api/invoice", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          bookingRef,
          guideName: guide.displayName,
          touristName: tourist.name || guestName || "Client",
          touristEmail: invoiceEmail,
          date: new Date(date).toLocaleDateString("fr-FR"),
          duration: duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)",
          persons: parseInt(persons) || 1,
          transport: !!transport,
          paymentMethod: paymentMethod || "cash",
          basePrice: price,
          extraCost: persons > 2 ? Math.round((totalPrice || price) * (parseInt(persons) - 2) * 0.15) : 0,
          transportCost: transport ? 300 : 0,
          serviceFee: 25,
          total: totalPrice || price
        })
      });
    } catch(invErr) { console.error("Invoice error:", invErr); }
    */

    console.log("BOOKING SUCCESS:", bookingRef); return NextResponse.json({ booking, whatsappUrl, bookingRef });
  } catch(e: any) {
    console.error("Booking error:", e);
    return NextResponse.json({ error: "Erreur serveur: " + e.message }, { status: 500 });
  }
}
