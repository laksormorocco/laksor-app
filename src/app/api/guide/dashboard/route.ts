import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });

  const guide = await prisma.guideProfile.findUnique({
    where: { id: guideId },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { tourist: true, slots: true }
      }
    }
  });

  if (!guide) return NextResponse.json({ error: "Guide non trouve" }, { status: 404 });

  const totalRevenue = guide.bookings
    .filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return NextResponse.json({ guide, totalRevenue });
}
