import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabaseId = url.searchParams.get("supabaseId");
  if (!supabaseId) return NextResponse.json({ error: "supabaseId requis" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { supabaseId },
    include: { guideProfile: true }
  });

  if (!user) return NextResponse.json({ role: "TOURIST", guideId: null });

  return NextResponse.json({
    role: user.role,
    guideId: user.guideProfile?.id || null,
    name: user.name,
  });
}
