import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { verifyInvoiceToken } from "@/lib/invoiceToken";

export default async function InvoicePage({ params, searchParams }: { params: { bookingId: string }, searchParams: { token?: string } }) {
  if (!searchParams.token || !verifyInvoiceToken(params.bookingId, searchParams.token)) notFound();
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      guide: { select: { displayName: true, city: true, phone: true } },
      tourist: { select: { name: true, email: true } },
      slots: true,
    }
  });

  if (!booking) notFound();

  const bookingRef = booking.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || "LAK-" + booking.id.slice(-8).toUpperCase();
  const total = Number(booking.totalPrice);
  const deposit = Math.round(total * 0.3);
  const isPaid = booking.paymentMethod === "deposit" || booking.paymentMethod === "full";
  const paymentLabel = booking.paymentMethod === "deposit" ? "Acompte 30%" : booking.paymentMethod === "full" ? "100% en ligne" : "Cash le jour J";
  const dateStr = new Date(booking.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const duration = booking.duration === "FULL_DAY" ? "Journee complete (8h)" : "Demi-journee (4h)";
  const emissionDate = new Date().toLocaleDateString("fr-FR");

  return (
    <html>
    <head>
      <meta charSet="utf-8" />
      <title>Facture {bookingRef} - Laksor</title>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; background: #fff; color: #111; }
        .page { max-width: 794px; margin: 0 auto; padding: 40px; }
        .header { background: #111; border-radius: 12px; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 800; color: #B88A44; letter-spacing: 4px; }
        .header-right { text-align: right; }
        .header-title { font-size: 16px; color: #fff; font-weight: 700; }
        .header-sub { font-size: 11px; color: #888; margin-top: 4px; }
        .ref-box { background: #F6F1E8; border: 1px solid #EADCC8; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; margin-bottom: 20px; }
        .ref-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .ref-value { font-size: 22px; font-weight: 800; color: #B88A44; margin-top: 4px; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .card { background: #F6F1E8; border: 1px solid #EADCC8; border-radius: 10px; padding: 16px; }
        .card-title { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .card-name { font-size: 14px; font-weight: 700; color: #111; }
        .card-sub { font-size: 11px; color: #888; margin-top: 3px; }
        table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #EADCC8; border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
        th { background: #F6F1E8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; padding: 10px 16px; text-align: left; }
        td { padding: 10px 16px; font-size: 12px; border-bottom: 1px solid #F6F1E8; }
        td:last-child { text-align: right; font-weight: 600; }
        .total-row td { font-size: 16px; font-weight: 800; color: #B88A44; border-bottom: none; padding-top: 14px; }
        .footer { text-align: center; margin-top: 24px; }
        .badge { background: #7D8F69; color: #fff; font-size: 10px; font-weight: 700; padding: 6px 16px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
        .footer-text { font-size: 10px; color: #aaa; line-height: 1.8; }
        .print-btn { position: fixed; bottom: 24px; right: 24px; background: #B88A44; color: #fff; border: none; border-radius: 99px; padding: 14px 24px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: Georgia, serif; box-shadow: 0 4px 20px rgba(184,138,68,0.4); }
        @media print { .print-btn { display: none; } body { background: #fff; } }
      `}</style>
    </head>
    <body>
      <div className="page">
        <div className="header">
          <div className="logo">LAKSOR</div>
          <div className="header-right">
            <div className="header-title">Facture de reservation</div>
            <div className="header-sub">laksor.ma · +212 6 57 43 63 42</div>
          </div>
        </div>

        <div className="ref-box">
          <div>
            <div className="ref-label">Numero de reservation</div>
            <div className="ref-value">{bookingRef}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="ref-label">Date d emission</div>
            <div style={{fontSize:14,fontWeight:700,color:"#111",marginTop:4}}>{emissionDate}</div>
          </div>
        </div>

        <div className="parties">
          <div className="card">
            <div className="card-title">Client</div>
            <div className="card-name">{booking.tourist?.name || "Client"}</div>
            <div className="card-sub">{booking.tourist?.email}</div>
          </div>
          <div className="card">
            <div className="card-title">Guide</div>
            <div className="card-name">{booking.guide?.displayName}</div>
            <div className="card-sub">{booking.guide?.city} · Guide certifie Ministere du Tourisme</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Designation</th>
              <th style={{textAlign:"right"}}>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Date de la visite</td><td style={{textAlign:"right",fontWeight:400}}>{dateStr}</td></tr>
            <tr><td>Duree</td><td style={{textAlign:"right",fontWeight:400}}>{duration}</td></tr>
            <tr><td>Participants</td><td style={{textAlign:"right",fontWeight:400}}>{booking.persons} personnes</td></tr>
            <tr><td>Prestation guide</td><td>{total - 25} MAD</td></tr>
            <tr><td>Frais de service Laksor</td><td>25 MAD</td></tr>
            <tr><td>Mode de paiement</td><td style={{textAlign:"right",fontWeight:400}}>{paymentLabel}</td></tr>
            {isPaid && <tr><td>Acompte regle</td><td>{deposit} MAD</td></tr>}
            {isPaid && <tr><td>Reste a regler le jour J</td><td>{total - deposit} MAD</td></tr>}
          </tbody>
          <tfoot>
            <tr className="total-row"><td>TOTAL</td><td>{total} MAD</td></tr>
          </tfoot>
        </table>

        <div style={{background:"#F6F1E8",borderRadius:10,padding:"20px 24px",marginBottom:16,textAlign:"center",border:"1px solid #EADCC8"}}>
          <div style={{fontSize:15,fontWeight:700,color:"#B88A44",marginBottom:8,fontFamily:"Georgia,serif"}}>Merci de voyager avec Laksor</div>
          <div style={{fontSize:11,color:"#888",lineHeight:1.7}}>
            Votre experience au Maroc commence ici. Chaque guide et chauffeur Laksor est certifie par le <strong style={{color:"#111"}}>Ministere du Tourisme marocain</strong> et personnellement valide par notre equipe.<br/>
            Disponibles <strong style={{color:"#111"}}>7j/7</strong> via <strong style={{color:"#111"}}>laksor.ma</strong> ou WhatsApp au <strong style={{color:"#111"}}>+212 6 57 43 63 42</strong><br/>
            <em>Bienvenue au Maroc authentique.</em>
          </div>
        </div>

        <div className="footer">
          <div className="badge">Guide certifie Ministere du Tourisme Marocain</div>
          <div className="footer-text">
            LAKSOR Morocco · laksor.ma · +212 6 57 43 63 42<br/>
            Cette facture est generee automatiquement par la plateforme Laksor.<br/>
            {new Date().getFullYear()} Laksor Morocco. Tous droits reserves.
          </div>
        </div>
      </div>

      <button className="print-btn" onClick={() => window.print()}>
        Telecharger / Imprimer
      </button>
    </body>
    </html>
  );
}
