import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { guideId, supabaseId, startDate, days, persons, description } = await req.json();
    
    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });

    const request = await prisma.customRequest.create({
      data: {
        touristId: user.id,
        guideId,
        startDate: new Date(startDate),
        days,
        persons,
        description,
        status: "PENDING"
      },
      include: { guide: true }
    });

    // Notif WhatsApp au guide
    let whatsappUrl = null;
    if (request.guide?.phone) {
      const phone = request.guide.phone.replace(/[^0-9]/g, "");
      const msg = encodeURIComponent(
        "🎯 Nouvelle demande sur mesure Laksor !\n\n" +
        "Date: " + new Date(startDate).toLocaleDateString("fr-FR") + "\n" +
        "Jours: " + days + "\n" +
        "Personnes: " + persons + "\n" +
        "Description: " + description + "\n\n" +
        "Repondre sur: https://laksor.vercel.app/dashboard/guide"
      );
      whatsappUrl = "https://wa.me/" + phone + "?text=" + msg;
    }

    return NextResponse.json({ request, whatsappUrl });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  const supabaseId = url.searchParams.get("supabaseId");

  if (guideId) {
    const requests = await prisma.customRequest.findMany({
      where: { guideId },
      orderBy: { createdAt: "desc" },
      include: { tourist: true }
    });
    return NextResponse.json({ requests });
  }

  if (supabaseId) {
    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) return NextResponse.json({ requests: [] });
    const requests = await prisma.customRequest.findMany({
      where: { touristId: user.id },
      orderBy: { createdAt: "desc" },
      include: { guide: true }
    });
    return NextResponse.json({ requests });
  }

  return NextResponse.json({ requests: [] });
}

export async function PATCH(req: Request) {
  try {
    const { requestId, status, proposedPrice } = await req.json();
    const request = await prisma.customRequest.update({
      where: { id: requestId },
      data: { status, ...(proposedPrice ? { proposedPrice } : {}) }
    });
    return NextResponse.json({ request });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
