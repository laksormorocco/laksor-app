import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { tourType: string } }) {
  const tourType = params.tourType.toUpperCase();

  const template = await prisma.tourTemplate.findFirst({
    where: { tourType: tourType as any, isActive: true }
  });

  if (!template) return NextResponse.json({ error: "Tour introuvable" }, { status: 404 });

  const guideTours = await prisma.guideTour.findMany({
    where: { templateId: template.id, isActive: true },
    include: {
      guide: {
        select: {
          id: true, displayName: true, city: true, avatar: true,
          avgRating: true, totalReviews: true, languages: true
        }
      }
    },
    orderBy: { price: "asc" }
  });

  const guides = guideTours.map(gt => ({
    guideId: gt.guideId,
    templateId: gt.templateId,
    price: gt.price,
    guide: gt.guide
  }));

  return NextResponse.json({ tour: template, guides });
}
