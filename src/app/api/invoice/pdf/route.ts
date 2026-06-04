import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyInvoiceToken } from "@/lib/invoiceToken";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const bookingId = url.searchParams.get("bookingId");
  const token = url.searchParams.get("token");

  if (!bookingId || !token || !verifyInvoiceToken(bookingId, token)) {
    return new NextResponse("Acces refuse", { status: 403 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, date: true, duration: true, persons: true, totalPrice: true, notes: true,
      guide: { select: { displayName: true, city: true } },
      tourist: { select: { name: true, email: true } },
      slots: true
    }
  });

  if (!booking) return new NextResponse("Introuvable", { status: 404 });

  const bookingRef = booking.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || "LAK-" + booking.id.slice(-8).toUpperCase();
  const total = Number(booking.totalPrice);
  const deposit = Math.round(total * 0.3);
  const isPaid = (booking.notes || "").includes("Acompte") || (booking.notes || "").includes("100%");
  const paymentLabel = isPaid ? ((booking.notes || "").includes("Acompte") ? "Acompte 30%" : "100% en ligne") : "Cash le jour J";
  const dateStr = new Date(booking.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const duration = booking.duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)";
  const emissionDate = new Date().toLocaleDateString("fr-FR");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Facture ${bookingRef} - Laksor</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Georgia, serif; background:#fff; color:#111; }
.page { max-width:794px; margin:0 auto; padding:40px; }
.header { background:#111; border-radius:12px; padding:28px 32px; display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
.logo { font-size:22px; font-weight:800; color:#B88A44; letter-spacing:4px; }
.header-right { text-align:right; }
.header-title { font-size:16px; color:#fff; font-weight:700; }
.header-sub { font-size:11px; color:#888; margin-top:4px; }
.ref-box { background:#F6F1E8; border:1px solid #EADCC8; border-radius:10px; padding:16px 20px; display:flex; justify-content:space-between; margin-bottom:20px; }
.ref-label { font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px; }
.ref-value { font-size:22px; font-weight:800; color:#B88A44; margin-top:4px; }
.parties { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.card { background:#F6F1E8; border:1px solid #EADCC8; border-radius:10px; padding:16px; }
.card-title { font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
.card-name { font-size:14px; font-weight:700; color:#111; }
.card-sub { font-size:11px; color:#888; margin-top:3px; }
table { width:100%; border-collapse:collapse; border:1px solid #EADCC8; border-radius:10px; overflow:hidden; margin-bottom:16px; }
th { background:#F6F1E8; font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#888; padding:10px 16px; text-align:left; }
td { padding:10px 16px; font-size:12px; border-bottom:1px solid #F6F1E8; }
td.right { text-align:right; font-weight:600; }
.total td { font-size:16px; font-weight:800; color:#B88A44; border-bottom:none; padding-top:14px; }
.thanks { background:#F6F1E8; border-radius:10px; padding:20px 24px; margin-bottom:16px; text-align:center; border:1px solid #EADCC8; }
.footer { text-align:center; }
.badge { background:#7D8F69; color:#fff; font-size:10px; font-weight:700; padding:6px 16px; border-radius:20px; display:inline-block; margin-bottom:10px; }
.footer-text { font-size:10px; color:#aaa; line-height:1.8; }
.print-btn { position:fixed; bottom:24px; right:24px; background:#B88A44; color:#fff; border:none; border-radius:99px; padding:14px 24px; font-size:14px; font-weight:700; cursor:pointer; font-family:Georgia,serif; box-shadow:0 4px 20px rgba(184,138,68,0.4); }
@media print { .print-btn { display:none; } }
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">LAKSOR</div>
    <div class="header-right">
      <div class="header-title">Facture de reservation</div>
      <div class="header-sub">laksor.ma · +212 6 57 43 63 42</div>
    </div>
  </div>
  <div class="ref-box">
    <div><div class="ref-label">Numero de reservation</div><div class="ref-value">${bookingRef}</div></div>
    <div style="text-align:right"><div class="ref-label">Date emission</div><div style="font-size:14px;font-weight:700;color:#111;margin-top:4px">${emissionDate}</div></div>
  </div>
  <div class="parties">
    <div class="card"><div class="card-title">Client</div><div class="card-name">${booking.tourist?.name || "Client"}</div><div class="card-sub">${booking.tourist?.email || ""}</div></div>
    <div class="card"><div class="card-title">Guide</div><div class="card-name">${booking.guide?.displayName || ""}</div><div class="card-sub">${booking.guide?.city || ""} · Guide certifie Ministere du Tourisme</div></div>
  </div>
  <table>
    <thead><tr><th>Designation</th><th style="text-align:right">Montant</th></tr></thead>
    <tbody>
      <tr><td>Date de la visite</td><td class="right" style="font-weight:400">${dateStr}</td></tr>
      <tr><td>Duree</td><td class="right" style="font-weight:400">${duration}</td></tr>
      <tr><td>Participants</td><td class="right" style="font-weight:400">${booking.persons} personnes</td></tr>
      <tr><td>Prestation guide</td><td class="right">${total - 25} MAD</td></tr>
      <tr><td>Frais de service Laksor</td><td class="right">25 MAD</td></tr>
      <tr><td>Mode de paiement</td><td class="right" style="font-weight:400">${paymentLabel}</td></tr>
      ${isPaid ? `<tr><td>Acompte regle</td><td class="right">${deposit} MAD</td></tr><tr><td>Reste a regler le jour J</td><td class="right">${total - deposit} MAD</td></tr>` : ""}
    </tbody>
    <tfoot><tr class="total"><td>TOTAL</td><td class="right">${total} MAD</td></tr></tfoot>
  </table>
  <div class="thanks">
    <div style="font-size:15px;font-weight:700;color:#B88A44;margin-bottom:8px">Merci de voyager avec Laksor</div>
    <div style="font-size:11px;color:#888;line-height:1.7">Votre experience au Maroc commence ici. Chaque guide est certifie par le <strong style="color:#111">Ministere du Tourisme marocain</strong>.<br>Disponibles <strong style="color:#111">7j/7</strong> via <strong style="color:#111">laksor.ma</strong> ou WhatsApp au <strong style="color:#111">+212 6 57 43 63 42</strong><br><em>Bienvenue au Maroc authentique.</em></div>
  </div>
  <div class="footer">
    <div class="badge">Guide certifie Ministere du Tourisme Marocain</div>
    <div class="footer-text">LAKSOR Morocco · laksor.ma · +212 6 57 43 63 42<br>Cette facture est generee automatiquement par la plateforme Laksor.</div>
  </div>
</div>
<button class="print-btn" onclick="window.print()">Telecharger / Imprimer</button>
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
