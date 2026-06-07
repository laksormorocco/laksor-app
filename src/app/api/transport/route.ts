import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const transporters = await prisma.transporter.findMany({
    where: { status: "APPROVED", ...(city ? { city } : {}) },
    include: { vehicles: { where: { isActive: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ transporters });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, displayName, phone, city, bio } = body;
  if (!userId || !displayName) return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });
  const transporter = await prisma.transporter.create({
    data: { userId, displayName, phone, city: city || "", bio: bio || "", status: "PENDING" }
  });
  return NextResponse.json({ transporter });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const transporter = await prisma.transporter.update({ where: { id }, data });
  return NextResponse.json({ transporter });
}
