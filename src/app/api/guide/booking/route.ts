import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: { guide: true, tourist: true }
    });

    if (status === "CONFIRMED") {
      const date = new Date(booking.date).toLocaleDateString("fr-FR");
      const duree = booking.duration === "HALF_DAY" ? "Demi-journee (4h)" : "Journee complete (8h)";

      // Email au touriste
      if (booking.tourist?.email) {
        await resend.emails.send({
          from: "Laksor <onboarding@resend.dev>",
          to: "laksor.morocco@gmail.com",
          subject: "Votre reservation est confirmee - Laksor",
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8F5F0;">
              <div style="background:#22c55e;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
                <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">✅ Reservation confirmee !</h1>
                <p style="color:rgba(255,255,255,0.9);margin:0;">Votre guide a accepte votre demande</p>
              </div>
              <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
                <h2 style="color:#123EAB;margin:0 0 16px;">Details</h2>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:8px 0;color:#666;">Guide</td><td style="text-align:right;font-weight:700;">${booking.guide?.displayName}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Date</td><td style="text-align:right;font-weight:700;">${date}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Duree</td><td style="text-align:right;font-weight:700;">${duree}</td></tr>
                  <tr><td style="padding:8px 0;color:#666;">Personnes</td><td style="text-align:right;font-weight:700;">${booking.persons}</td></tr>
                  <tr style="border-top:2px solid #e8e0d6;"><td style="padding:12px 0;color:#123EAB;font-weight:700;">Total</td><td style="text-align:right;font-weight:900;font-size:20px;color:#123EAB;">${booking.totalPrice} MAD</td></tr>
                </table>
              </div>
              <div style="background:#fff7ed;border-radius:14px;padding:16px;border:1px solid #fed7aa;">
                <p style="color:#c2410c;font-weight:700;margin:0 0 4px;">Contact guide</p>
                <p style="color:#9a3412;font-size:13px;margin:0;">WhatsApp : ${booking.guide?.phone || "Non disponible"}</p>
              </div>
            </div>
          `
        });
      }

      // WhatsApp au touriste si numéro disponible
      let whatsappUrl = null;
      if (booking.tourist) {
        const msg = encodeURIComponent(
          "✅ Votre reservation Laksor est confirmee !\n\n" +
          "Guide: " + (booking.guide?.displayName || "") + "\n" +
          "Date: " + date + "\n" +
          "Duree: " + duree + "\n" +
          "Total: " + booking.totalPrice + " MAD\n\n" +
          "Contact guide: " + (booking.guide?.phone || "")
        );
        // WhatsApp au guide avec infos touriste
      if (booking.guide?.phone) {
        const phone = booking.guide.phone.replace(/[^0-9]/g, "");
        whatsappUrl = "https://wa.me/" + phone + "?text=" + msg;
      } else {
        whatsappUrl = "https://wa.me/?text=" + msg;
      }
      }

      return NextResponse.json({ booking, whatsappUrl });
    }

    return NextResponse.json({ booking });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
