import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const templates = await prisma.tourTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      guideTours: {
        where: { isActive: true },
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
    guideCount: t.guideTours.length,
    minPrice: t.guideTours.length > 0 ? Math.min(...t.guideTours.map(g => Number(g.price))) : null,
  }));

  return NextResponse.json({ tours });
}
