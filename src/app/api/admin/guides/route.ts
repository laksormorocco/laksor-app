import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "PENDING";
  const guides = await prisma.guideProfile.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ guides });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const guide = await prisma.guideProfile.update({
      where: { id: String(id) },
      data: { status: status as any }
    });
    return NextResponse.json({ guide });
  } catch(e: any) {
    return NextResponse.json({ error: e.message || "Erreur" }, { status: 500 });
  }
}
