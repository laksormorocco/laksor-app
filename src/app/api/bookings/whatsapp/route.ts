import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { bookingId, whatsapp, bookingRef, touristName } = await req.json();
    if (!bookingId || !whatsapp) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });

    // Sauvegarder en DB
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { notes: { set: (await prisma.booking.findUnique({ where: { id: bookingId }, select: { notes: true } }))?.notes + " | WA:" + whatsapp } },
      include: { guide: { select: { phone: true, displayName: true } } }
    });

    // Notifier admin via WhatsApp
    const adminPhone = "212657436342";
    const msg = encodeURIComponent(
      "📱 Nouveau WhatsApp client\n\n" +
      "Reservation: " + bookingRef + "\n" +
      "Client: " + touristName + "\n" +
      "WhatsApp: " + whatsapp
    );
    const notifyUrl = "https://wa.me/" + adminPhone + "?text=" + msg;

    return NextResponse.json({ success: true, notifyUrl });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
