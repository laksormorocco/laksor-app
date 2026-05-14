import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { guideId, ...updateData } = data;
    const guide = await prisma.guideProfile.update({
      where: { id: guideId },
      data: {
        displayName: updateData.displayName,
        city: updateData.city,
        phone: updateData.phone,
        bio: updateData.bio,
        halfDayPrice: parseFloat(updateData.halfDayPrice),
        fullDayPrice: parseFloat(updateData.fullDayPrice),
        languages: updateData.languages,
        specialties: updateData.specialties,
        avatar: updateData.avatar,
      }
    });
    return NextResponse.json({ guide });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
