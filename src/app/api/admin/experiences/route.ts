import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  
  if (id) {
    const experience = await prisma.guideExperience.findUnique({ where: { id } });
    return NextResponse.json({ experience });
  }
  
  const experiences = await prisma.guideExperience.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      guide: { select: { displayName: true, city: true, avatar: true } }
    }
  });
  return NextResponse.json({ experiences });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const exp = await prisma.guideExperience.update({
    where: { id },
    data: { status, isActive: status === "APPROVED" }
  });
  return NextResponse.json({ experience: exp });
}
