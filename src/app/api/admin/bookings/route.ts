import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { guide: { select: { id:true, displayName:true, city:true, avatar:true, phone:true } }, tourist: { select: { id:true, name:true, email:true, avatar:true } }, slots: true }
  });
  return NextResponse.json({ bookings });
}
