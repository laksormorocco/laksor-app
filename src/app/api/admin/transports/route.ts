import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "PENDING";
  const transports = await prisma.transportProfile.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id:true, email:true, name:true, avatar:true } } }
  });
  return NextResponse.json({ transports });
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const transport = await prisma.transportProfile.update({
      where: { id: String(id) },
      data: { status: status as any }
    });
    return NextResponse.json({ transport });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
