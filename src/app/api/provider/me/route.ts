import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const supabaseId = searchParams.get("supabaseId");
    if (!supabaseId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const provider = await prisma.provider.findUnique({
      where: { supabaseId },
      include: { experiences: { orderBy: { createdAt: "desc" } } }
    });

    if (!provider) return NextResponse.json({ error: "Prestataire introuvable" }, { status: 404 });
    // Récupérer les bookings liés aux expériences du provider
    const providerWithExp = provider as any;
    const expIds = providerWithExp.experiences?.map((e: any) => e.id) || [];
    const bookings = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        notes: { contains: "EXP:" }
      },
      select: { totalPrice: true, persons: true, createdAt: true, notes: true }
    }).then(bs => bs.filter(b => expIds.some((id: string) => b.notes?.includes("EXP:" + id))));

    return NextResponse.json({ provider, bookings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
