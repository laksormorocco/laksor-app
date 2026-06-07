import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const transporterId = url.searchParams.get("transporterId");
  if (!transporterId) return NextResponse.json({ error: "transporterId requis" }, { status: 400 });
  const vehicles = await prisma.vehicle.findMany({
    where: { transporterId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ vehicles });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { transporterId, type, brand, model, year, color, capacity, hasAC, hasWifi, hasWater, pricePerKm, fixedPrice } = body;
  if (!transporterId) return NextResponse.json({ error: "transporterId requis" }, { status: 400 });
  const vehicle = await prisma.vehicle.create({
    data: {
      transporterId, type: type || "SEDAN",
      brand, model, year: year ? Number(year) : null,
      color, capacity: Number(capacity) || 4,
      hasAC: hasAC !== false, hasWifi: !!hasWifi, hasWater: !!hasWater,
      pricePerKm: pricePerKm ? Number(pricePerKm) : null,
      fixedPrice: fixedPrice ? Number(fixedPrice) : null,
    }
  });
  return NextResponse.json({ vehicle });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  if (data.year) data.year = Number(data.year);
  if (data.capacity) data.capacity = Number(data.capacity);
  if (data.pricePerKm) data.pricePerKm = Number(data.pricePerKm);
  if (data.fixedPrice) data.fixedPrice = Number(data.fixedPrice);
  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return NextResponse.json({ vehicle });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
