import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const guideId = body.guideId;
    if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });
    await prisma.guideProfile.update({
      where: { id: guideId },
      data: { views: { increment: 1 } }
    });
    return NextResponse.json({ success: true });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
