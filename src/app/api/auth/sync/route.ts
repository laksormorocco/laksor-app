import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { supabaseId, email, name, avatar } = await req.json();
    if (!supabaseId || !email) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });

    // Verifier si cet email correspond a un guide existant
    const existingUser = await prisma.user.findFirst({
      where: { email },
      include: { guideProfile: { select: { id: true } } }
    });

    let role = "TOURIST";
    if (existingUser?.role === "ADMIN") role = "ADMIN";
    else if (existingUser?.role === "GUIDE" || existingUser?.guideProfile) role = "GUIDE";

    const user = await prisma.user.upsert({
      where: { supabaseId },
      update: { email, name: name || email, avatar: avatar || undefined, role: role as any },
      create: { supabaseId, email, name: name || email, avatar: avatar || null, role: role as any },
    });

    // Si un autre compte avec cet email existe (import fictif), merger le guide profile
    if (existingUser && existingUser.supabaseId !== supabaseId) {
      await prisma.guideProfile.updateMany({
        where: { userId: existingUser.id },
        data: { userId: user.id }
      }).catch(() => {});
      // Supprimer l ancien user fictif
      await prisma.user.delete({ where: { id: existingUser.id } }).catch(() => {});
    }

    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
