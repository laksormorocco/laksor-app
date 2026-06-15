export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guideId, supabaseId, date, duration, persons, totalPrice, notes, paymentMethod, startTime, transport, guestName, guestContact, expId, tourType } = body;

    if (!guideId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

    const guide = await prisma.guideProfile.findUnique({ where: { id: guideId }, include: { user: { select: { email: true } } } });
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

    let whatsappUrl = null; // WhatsApp désactivé - notifications par email uniquement


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

    // Email de notification au guide
    if (guide.user?.email) {
      try {
        const netPrice = Math.round((Number(totalPrice || price) - 25) / 1.25);
        const payLabel = paymentMethod === 'deposit' ? 'Acompte 30%' : paymentMethod === 'full' ? '100% en ligne' : 'Cash le jour J';
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Laksor <onboarding@resend.dev>',
          to: guide.user.email,
          subject: 'Nouvelle réservation — ' + bookingRef,
          html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
            <p><strong>Référence :</strong> ${bookingRef}</p>
            <p><strong>Touriste :</strong> ${tourist.name || guestName || 'Client'}</p>
            <p><strong>Date :</strong> ${dateStr}</p>
            <p><strong>Durée :</strong> ${duree}</p>
            <p><strong>Personnes :</strong> ${persons}</p>
            <p><strong>Paiement :</strong> ${payLabel}</p>
            <p><strong>Votre gain :</strong> ${netPrice} MAD</p>
            <p style="color:#888;font-size:12px">Connectez-vous à votre dashboard pour gérer cette réservation.</p>
            <a href="https://laksor.vercel.app/dashboard/guide" style="display:inline-block;background:#B88A44;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;margin-top:12px">Voir mon dashboard</a>
          </div>`
        });
      } catch(e) { console.error('Guide email error:', e); }
    }

    // Email de notification au prestataire si expérience provider
    if (expId) {
      try {
        const exp = await prisma.guideExperience.findUnique({
          where: { id: expId },
          include: { provider: true }
        });
        if (exp?.provider?.email) {
          const netPrice = Math.round((Number(totalPrice || price) - 25) / 1.25);
          const payLabel = paymentMethod === 'deposit' ? 'Acompte 30%' : paymentMethod === 'full' ? '100% en ligne' : 'Cash le jour J';
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Laksor <onboarding@resend.dev>',
            to: exp.provider.email,
            subject: 'Nouvelle réservation — ' + bookingRef,
            html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
              <p><strong>Référence :</strong> ${bookingRef}</p>
              <p><strong>Expérience :</strong> ${exp.title}</p>
              <p><strong>Date :</strong> ${dateStr}</p>
              <p><strong>Personnes :</strong> ${persons}</p>
              <p><strong>Paiement :</strong> ${payLabel}</p>
              <p><strong>Votre gain :</strong> ${netPrice} MAD</p>
              <p style="color:#888;font-size:12px">Connectez-vous à votre dashboard pour gérer cette réservation.</p>
              <a href="https://laksor.vercel.app/provider/dashboard" style="display:inline-block;background:#B88A44;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;margin-top:12px">Voir mon dashboard</a>
            </div>`
          });
        }
      } catch(e) { console.error('Provider email error:', e); }
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
