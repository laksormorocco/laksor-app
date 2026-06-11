import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { expId } = await req.json();
    if (!expId) return NextResponse.json({ ok: false });
    await prisma.guideExperience.update({
      where: { id: expId },
      data: { viewCount: { increment: 1 } }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
