import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const templateId = url.searchParams.get("templateId");
  const guideId = url.searchParams.get("guideId");
  
  const reviews = await prisma.tourReview.findMany({
    where: {
      ...(templateId ? { templateId } : {}),
      ...(guideId ? { guideId } : {}),
    },
    include: { author: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avg: Math.round(avg * 10) / 10, total: reviews.length });
}

export async function POST(req: Request) {
  const { templateId, guideId, authorId, bookingId, rating, comment } = await req.json();
  if (!templateId || !guideId || !authorId || !rating) {
    return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });
  }
  const review = await prisma.tourReview.create({
    data: { templateId, guideId, authorId, bookingId, rating: Number(rating), comment }
  });
  return NextResponse.json({ review });
}
