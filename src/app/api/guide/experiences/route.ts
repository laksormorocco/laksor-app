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
  try {
    const body = await req.json();
    const { id, guideId, category, isLaksorExp, providerContact, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
    const data: any = {};
    const allowed = ["title","description","duration","groupSize","difficulty","city","meetingPoint","status","isActive","transportRequired","photos","tags","included","notIncluded","pricePerPerson","price","groupThreshold1","groupDiscount1","groupThreshold2","groupDiscount2","itinerary"];
    for (const key of allowed) { if (rest[key] !== undefined) data[key] = rest[key]; }
    if (providerContact !== undefined) data.providerContact = providerContact;
    if (data.price) data.price = Number(data.price);
    ["groupThreshold1","groupDiscount1","groupThreshold2","groupDiscount2"].forEach(k => { if (data[k]) data[k] = Number(data[k]); });
    const exp = await prisma.guideExperience.update({ where: { id }, data });
    return NextResponse.json({ experience: exp });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, code: e.code }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  await prisma.guideExperience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
