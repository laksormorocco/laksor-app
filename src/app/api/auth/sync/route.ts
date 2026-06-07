import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { supabaseId, email, name, avatar } = await req.json();
    if (!supabaseId || !email) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

    const user = await prisma.user.upsert({
      where: { supabaseId },
      update: { 
        email,
        name: name || email,
        avatar: avatar || undefined,
      },
      create: {
        supabaseId,
        email,
        name: name || email,
        avatar: avatar || null,
        role: "TOURIST",
      }
    });

    return NextResponse.json({ user });
  } catch(e: any) {
    console.error("Sync error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
