import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guideId = url.searchParams.get("guideId");

  const guide = await prisma.guideProfile.findUnique({
    where: { id: guideId },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          tourist: { select: { id: true, name: true, email: true, avatar: true } },
          slots: true,
        },
      },
      tours: {
        include: { template: true },
      },
    },
  });


  const formattedBookings = guide.bookings.map((b: any) => ({
    ...b,
    date: b.slots?.[0]?.date || b.createdAt,
    persons: b.slots?.[0]?.persons || 1,
    duration: b.slots?.[0]?.type || b.duration,
  }));

  const totalRevenue = guide.bookings
    .filter((b: any) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum: number, b: any) => sum + Number(b.totalPrice), 0);

  return NextResponse.json({
    guide: { ...guide, bookings: formattedBookings },
    totalRevenue,
  });
}
