import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { supabaseId, email, name, avatar } = await req.json();
    if (!supabaseId || !email) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });

    // Verifier si cet email existe deja avec un role guide/admin
    const existingByEmail = await prisma.user.findFirst({
      where: { email, NOT: { supabaseId } },
      select: { id: true, role: true }
    });

    let role: string = "TOURIST";
    if (existingByEmail?.role === "ADMIN") role = "ADMIN";
    else if (existingByEmail?.role === "GUIDE") role = "GUIDE";

    const user = await prisma.user.upsert({
      where: { supabaseId },
      update: { email, name: name || email, avatar: avatar || undefined, role: role as any },
      create: { supabaseId, email, name: name || email, avatar: avatar || null, role: role as any },
    });

    // Lier le profil guide si necessaire
    if (role === "GUIDE" && existingByEmail) {
      await prisma.guideProfile.updateMany({
        where: { userId: existingByEmail.id },
        data: { userId: user.id }
      }).catch(() => {});
    }

    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
