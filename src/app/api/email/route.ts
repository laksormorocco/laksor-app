import { Resend } from "resend";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, guideName, date, persons, price, duration } = await req.json();

    await resend.emails.send({
      from: "Laksor <onboarding@resend.dev>",
      to,
      subject: "Confirmation de votre reservation - Laksor",
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8F5F0;">
          <div style="background:#123EAB;borderRadius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#fff;font-size:28px;margin:0 0 8px;">🎉 Reservation confirmee !</h1>
            <p style="color:rgba(255,255,255,0.8);margin:0;">Laksor - Tour Guide Morocco</p>
          </div>
          <div style="background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;">
            <h2 style="color:#123EAB;font-size:18px;margin:0 0 16px;">Details de votre reservation</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Guide</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${guideName}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Date</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${date}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Duree</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${duration}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Personnes</td><td style="padding:8px 0;font-weight:700;font-size:14px;text-align:right;">${persons}</td></tr>
              <tr style="border-top:2px solid #e8e0d6;"><td style="padding:12px 0;color:#123EAB;font-weight:700;font-size:16px;">Total</td><td style="padding:12px 0;font-weight:900;font-size:20px;color:#123EAB;text-align:right;">${price} MAD</td></tr>
            </table>
          </div>
          <div style="background:#fff7ed;border-radius:14px;padding:16px;margin-bottom:16px;border:1px solid #fed7aa;">
            <p style="color:#c2410c;font-weight:700;margin:0 0 4px;">Paiement cash</p>
            <p style="color:#9a3412;font-size:13px;margin:0;">Le paiement s effectue directement au guide le jour de la visite.</p>
          </div>
          <p style="text-align:center;color:#999;font-size:12px;">Laksor - Trouvez votre guide, vivez le Maroc</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
