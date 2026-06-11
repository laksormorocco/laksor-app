import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      include: { experiences: { select: { id: true, title: true, status: true } } }
    });
    return NextResponse.json({ providers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const provider = await prisma.provider.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json({ provider });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
