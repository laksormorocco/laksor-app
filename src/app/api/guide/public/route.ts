import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });

  const guide = await prisma.guideProfile.findUnique({
    where: { id: guideId },
    select: {
      id: true,
      displayName: true,
      avatar: true,
      city: true,
      avgRating: true,
      totalReviews: true,
      halfDayPrice: true,
      fullDayPrice: true,
      yearsExp: true,
      tours: { where: { isActive: true }, select: { id: true, isActive: true, price: true, template: { select: { id: true, title: true, description: true, duration: true, tourType: true, tags: true, included: true, groupSize: true } } } },
      experiences: { where: { isActive: true, status: "APPROVED" }, select: { id: true, title: true, description: true, duration: true, groupSize: true, difficulty: true, price: true, photos: true, tags: true, included: true, notIncluded: true, itinerary: true, transportRequired: true, meetingPoint: true } }
    }
  });

  if (!guide) return NextResponse.json({ error: "Guide non trouve" }, { status: 404 });
  return NextResponse.json({ guide });
}
