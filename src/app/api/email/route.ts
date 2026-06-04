import { Resend } from "resend";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, guideName, date, persons, price, duration, paymentMethod, guestName, bookingId } = await req.json();

    const isPaid = paymentMethod === "deposit" || paymentMethod === "full";
    const deposit = Math.round(Number(price) * 0.3);
    const reste = Number(price) - deposit;
    const paymentLabel = paymentMethod === "deposit" ? "Acompte 30%" : paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";
    const ref = bookingId ? bookingId.slice(-8).toUpperCase() : "LAKSOR";

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F6F1E8;font-family:Georgia,serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <div style="background:#111111;border-radius:20px;padding:32px;text-align:center;margin-bottom:20px;">
    <div style="font-size:13px;font-weight:800;color:#B88A44;letter-spacing:3px;margin-bottom:12px;">LAKSOR</div>
    <h1 style="color:#fff;font-size:24px;margin:0 0 8px;">Reservation confirmee !</h1>
    <p style="color:rgba(255,255,255,0.6);margin:0;font-size:14px;">Bonjour ${guestName}, votre aventure au Maroc commence !</p>
  </div>

  <div style="background:#fff;border-radius:20px;padding:24px;margin-bottom:16px;border:1px solid #EADCC8;">
    <p style="color:#111;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Details de votre reservation</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Reference</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">#${ref}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Guide</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">${guideName}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Date</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">${date}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Duree</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">${duration}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Personnes</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">${persons}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #F6F1E8;">Paiement</td><td style="padding:8px 0;font-weight:700;font-size:13px;text-align:right;color:#111;">${paymentLabel}</td></tr>
      <tr><td style="padding:14px 0 0;color:#111;font-weight:800;font-size:15px;">Total</td><td style="padding:14px 0 0;font-weight:900;font-size:22px;color:#B88A44;text-align:right;">${price} MAD</td></tr>
      ${isPaid ? `<tr><td colspan="2" style="text-align:right;padding:4px 0;color:#7D8F69;font-size:12px;font-weight:600;">Acompte : ${deposit} MAD - Reste : ${reste} MAD le jour J</td></tr>` : ""}
    </table>
  </div>

  ${isPaid ? `
  <div style="background:#FFF8EE;border-radius:16px;padding:16px;margin-bottom:16px;border:1px solid rgba(184,138,68,0.3);">
    <p style="color:#B88A44;font-weight:700;margin:0 0 4px;font-size:13px;">The de bienvenu offert !</p>
    <p style="color:#888;font-size:12px;margin:0;">Votre guide vous offrira un the chez un cafe partenaire Laksor.</p>
  </div>` : ""}

  <div style="background:#fff;border-radius:20px;padding:20px;margin-bottom:16px;border:1px solid #EADCC8;">
    <p style="color:#111;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">Prochaines etapes</p>
    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#111;">1. Reservation confirmee</p>
    <p style="margin:0 0 10px;font-size:13px;color:#888;">2. Le guide vous contacte 72h avant la visite</p>
    <p style="margin:0;font-size:13px;color:#888;">3. Vivez l experience !</p>
  </div>

  <div style="background:#111;border-radius:20px;padding:24px;text-align:center;margin-bottom:16px;">
    <p style="color:#B88A44;font-size:16px;margin:0 0 10px;">Merci de voyager avec Laksor</p>
    <p style="color:rgba(255,255,255,0.6);font-size:12px;line-height:1.7;margin:0 0 12px;">Chaque guide et chauffeur est certifie par le Ministere du Tourisme marocain et valide par notre equipe.</p>
    <p style="color:rgba(255,255,255,0.6);font-size:12px;line-height:1.7;margin:0 0 16px;">Disponibles 7j/7 via laksor.ma ou WhatsApp au +212 6 57 43 63 42</p>
    <a href="https://wa.me/212657436342" style="display:inline-block;background:#7D8F69;color:white;text-decoration:none;padding:10px 24px;border-radius:99px;font-size:12px;font-weight:700;">Contacter Laksor sur WhatsApp</a>
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:12px 0 0;font-style:italic;">Bienvenue au Maroc authentique.</p>
  </div>

  <p style="text-align:center;color:#aaa;font-size:11px;">2026 Laksor Morocco - laksor.ma</p>
</div>
</body></html>`;

    await resend.emails.send({
      from: "Laksor <onboarding@resend.dev>",
      to,
      subject: "Reservation confirmee avec " + guideName + " - Laksor",
      html,
    });

    return NextResponse.json({ success: true });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
