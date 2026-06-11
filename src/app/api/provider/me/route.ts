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
    return NextResponse.json({ provider });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
