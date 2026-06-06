import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const supabaseId = url.searchParams.get("supabaseId");

  const user = await prisma.user.findUnique({
    where: supabaseId ? { supabaseId } : { email: email! },
    include: { guideProfile: { select: { id: true } } }
  });

  if (!user) return NextResponse.json({ role: "TOURIST" });
  if (user.role === "ADMIN") return NextResponse.json({ role: "ADMIN" });
  if (user.guideProfile) return NextResponse.json({ role: "GUIDE", guideId: user.guideProfile.id });
  return NextResponse.json({ role: "TOURIST", userId: user.id });
}
