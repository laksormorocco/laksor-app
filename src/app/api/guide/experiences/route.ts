import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ error: "guideId requis" }, { status: 400 });
  const experiences = await prisma.guideExperience.findMany({
    where: { guideId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { guideId, title, description, duration, groupSize, difficulty, price, city, meetingPoint, included, notIncluded, itinerary, photos, tags, transportRequired } = body;
  if (!title) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });
  const exp = await (prisma.guideExperience.create as any)({
    data: {
      ...(guideId ? { guideId } : {}),
      title, description: description || "",
      duration: duration || "4h", groupSize: groupSize || "1-6 pers.",
      difficulty: difficulty || "Facile", price: Number(price) || 0,
      city: city || "", meetingPoint: meetingPoint || "",
      included: included || [], notIncluded: notIncluded || [],
      itinerary: itinerary || [], photos: photos || [],
      tags: tags || [], transportRequired: transportRequired || false,
      status: "PENDING"
    }
  });
  return NextResponse.json({ experience: exp });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, guideId, ...rest } = body;
  const data: any = { ...rest };
  if (data.price) data.price = Number(data.price);
  if (data.groupThreshold1) data.groupThreshold1 = Number(data.groupThreshold1);
  if (data.groupDiscount1) data.groupDiscount1 = Number(data.groupDiscount1);
  if (data.groupThreshold2) data.groupThreshold2 = Number(data.groupThreshold2);
  if (data.groupDiscount2) data.groupDiscount2 = Number(data.groupDiscount2);
  delete data.category; delete data.data;
  const exp = await prisma.guideExperience.update({ where: { id }, data });
  return NextResponse.json({ experience: exp });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  await prisma.guideExperience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
