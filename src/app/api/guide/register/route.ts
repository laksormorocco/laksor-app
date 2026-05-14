import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const ADMIN_PHONE = "212657436342";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    let user = await prisma.user.findUnique({ where: { supabaseId: data.supabaseId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId: data.supabaseId,
          email: data.email,
          name: data.displayName,
          role: "GUIDE"
        }
      });
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { role: "GUIDE" } });
    }
    const guide = await prisma.guideProfile.create({
      data: {
        userId: user.id,
        displayName: data.displayName,
        city: data.city,
        phone: data.phone,
        bio: data.bio,
        halfDayPrice: data.halfDayPrice || 500,
        fullDayPrice: data.fullDayPrice || 950,
        languages: data.languages || [],
        specialties: data.specialties || [],
        status: "PENDING",
      }
    });

    const msg = encodeURIComponent(
      "🧭 Nouveau guide sur Laksor !\n\n" +
      "Nom: " + data.displayName + "\n" +
      "Ville: " + data.city + "\n" +
      "Tel: " + data.phone + "\n" +
      "Email: " + data.email + "\n\n" +
      "Valider sur: https://laksor.vercel.app/dashboard/admin"
    );

    return NextResponse.json({ 
      guide,
      whatsappUrl: "https://wa.me/" + ADMIN_PHONE + "?text=" + msg
    });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
