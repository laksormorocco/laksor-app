import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const templates = await prisma.tourTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      guideTours: {
        where: {
          isActive: true,
          ...(city ? { guide: { city } } : {})
        },
        select: { price: true, guideId: true }
      }
    }
  });

  const tours = templates.map(t => ({
    id: t.id,
    tourType: t.tourType,
    title: t.title,
    description: t.description,
    duration: t.duration,
    groupSize: t.groupSize,
    difficulty: t.difficulty,
    coverImage: t.coverImage,
    tags: t.tags,
    included: t.included,
    notIncluded: t.notIncluded,
    guideCount: t.guideTours.length,
    minPrice: t.guideTours.length > 0 ? Math.min(...t.guideTours.map(g => Number(g.price))) : null,
  }));

  const guideExperiences = await prisma.guideExperience.findMany({
      orderBy: { bookingCount: "desc" },
    where: {
    isActive: true,
    status: "APPROVED",
    ...(city ? { city } : {}),
  },
    include: { guide: { select: { id: true, displayName: true, city: true } } }
  });

  const experiences = (guideExperiences as any[]).map((exp: any) => ({
    id: exp.id,
    tourType: "CUSTOM",
    title: exp.title,
    description: exp.description,
    duration: exp.duration,
    groupSize: exp.groupSize,
    difficulty: exp.difficulty,
    coverImage: exp.photos?.[0] || null,
      photos: exp.photos || [],
    tags: exp.tags,
    guideCount: 1,
    minPrice: exp.price,
    included: exp.included,
    notIncluded: exp.notIncluded,
    isGuideExperience: true,
    privatePricePerPerson: exp.privatePricePerPerson || null,
      departureSlots: exp.departureSlots || [],
      pickupRadiusKm: exp.pickupRadiusKm || 10,
      pickupExtraFeePerPerson: exp.pickupExtraFeePerPerson || 110,
      languages: exp.languages || [],
    itinerary: exp.itinerary || [],
    isPrivateAvailable: exp.isPrivateAvailable || false,
    privatePrice: exp.privatePrice || null,
    privateMaxPersons: exp.privateMaxPersons || null,
    privateExtraPrice: exp.privateExtraPrice || null,
    guideId: exp.guideId,
    expId: exp.id,
    groupThreshold1: exp.groupThreshold1,
    groupDiscount1: exp.groupDiscount1,
    groupThreshold2: exp.groupThreshold2,
    groupDiscount2: exp.groupDiscount2,
    guide: exp.guide,
  }));

  return NextResponse.json({ tours: [...tours, ...experiences] });
}
