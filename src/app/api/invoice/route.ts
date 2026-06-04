import { NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import React from "react";
import InvoicePDF from "@/components/pdf/InvoicePDF";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      bookingRef, guideName, touristName, touristEmail,
      date, duration, persons, transport, paymentMethod,
      basePrice, extraCost, transportCost, serviceFee, total
    } = await req.json();

    // Generer PDF
    const element = React.createElement(InvoicePDF, {
      bookingRef, guideName, touristName, touristEmail,
      date, duration, persons, transport, paymentMethod,
      basePrice, extraCost, transportCost, serviceFee, total
    }) as unknown as React.ReactElement<any>;
    const buffer = await renderToBuffer(element);

    const base64 = Buffer.from(buffer).toString("base64");

    // Envoyer par email
    if (touristEmail) {
      await resend.emails.send({
        from: "Laksor <onboarding@resend.dev>",
        to: touristEmail,
        subject: "Votre facture Laksor - " + bookingRef,
        html: `<p>Bonjour ${touristName},</p><p>Veuillez trouver ci-joint votre facture de réservation <strong>${bookingRef}</strong>.</p><p>Merci de voyager avec Laksor.</p>`,
        attachments: [{
          filename: "facture-" + bookingRef + ".pdf",
          content: base64,
        }]
      });
    }

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=facture-" + bookingRef + ".pdf",
      }
    });
  } catch(e: any) {
    console.error("Invoice error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
