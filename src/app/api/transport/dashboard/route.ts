import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transportId = searchParams.get("transportId");

  if (!transportId) return NextResponse.json({ error: "transportId requis" }, { status: 400 });

  try {
    const transport = await prisma.transportProfile.findUnique({
      where: { id: transportId },
      include: {
        bookings: {
          include: { tourist: true },
          orderBy: { date: "desc" }
        }
      }
    });

    const totalRevenue = transport?.bookings
      .filter(b => b.status === "COMPLETED" || b.status === "CONFIRMED")
      .reduce((acc, b) => acc + b.totalPrice, 0) || 0;

    return NextResponse.json({ transport, totalRevenue });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
