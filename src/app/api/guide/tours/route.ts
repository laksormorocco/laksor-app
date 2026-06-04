import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });

  const [templates, guideTours] = await Promise.all([
    prisma.tourTemplate.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.guideTour.findMany({ where: { guideId }, include: { template: true } })
  ]);

  const result = templates.map(t => {
    const gt = guideTours.find(g => g.templateId === t.id);
    return {
      template: t,
      guideTour: gt || null,
      isActive: gt?.isActive || false,
      price: gt?.price || null,
    };
  });

  return NextResponse.json({ tours: result });
}

export async function PATCH(req: Request) {
  const { guideId, templateId, isActive, price } = await req.json();
  if (!guideId || !templateId) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });

  const existing = await prisma.guideTour.findFirst({ where: { guideId, templateId } });

  if (existing) {
    const updated = await prisma.guideTour.update({
      where: { id: existing.id },
      data: { isActive, price: price ? Number(price) : existing.price }
    });
    return NextResponse.json({ guideTour: updated });
  } else {
    const created = await prisma.guideTour.create({
      data: { guideId, templateId, isActive: true, price: price ? Number(price) : 0 }
    });
    return NextResponse.json({ guideTour: created });
  }
}
