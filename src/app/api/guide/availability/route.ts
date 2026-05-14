import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");
  if (!guideId) return NextResponse.json({ bookedDates: [] });

  const bookings = await prisma.booking.findMany({
    where: {
      guideId,
      status: { in: ["PENDING", "CONFIRMED"] }
    },
    select: { date: true, duration: true }
  });

  const bookedDates = bookings.map(b => ({
    date: new Date(b.date).toISOString().split("T")[0],
    duration: b.duration
  }));

  return NextResponse.json({ bookedDates });
}
