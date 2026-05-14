import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { bookingId, rating, comment, supabaseId } = await req.json();

    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { guide: true }
    });
    if (!booking) return NextResponse.json({ error: "Reservation non trouvee" }, { status: 404 });
    if (booking.status !== "COMPLETED") return NextResponse.json({ error: "La visite doit etre terminee" }, { status: 400 });

    const review = await prisma.review.create({
      data: {
        bookingId,
        authorId: user.id,
        guideId: booking.guideId,
        rating,
        comment,
      }
    });

    const allReviews = await prisma.review.findMany({
      where: { guideId: booking.guideId }
    });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.guideProfile.update({
      where: { id: booking.guideId },
      data: { avgRating, totalReviews: allReviews.length }
    });

    return NextResponse.json({ review });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ reviews: [] });

  const reviews = await prisma.review.findMany({
    where: { guideId },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });
  return NextResponse.json({ reviews });
}
