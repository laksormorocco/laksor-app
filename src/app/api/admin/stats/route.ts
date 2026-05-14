import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const [totalGuides, pendingGuides, approvedGuides, totalBookings, pendingBookings, confirmedBookings] = await Promise.all([
    prisma.guideProfile.count(),
    prisma.guideProfile.count({ where: { status: "PENDING" } }),
    prisma.guideProfile.count({ where: { status: "APPROVED" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
  ]);

  const revenue = await prisma.booking.aggregate({
    where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    _sum: { totalPrice: true, commission: true }
  });

  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { guide: true, tourist: true }
  });

  const recentGuides = await prisma.guideProfile.findMany({
    take: 5,
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    totalGuides, pendingGuides, approvedGuides,
    totalBookings, pendingBookings, confirmedBookings,
    totalRevenue: revenue._sum.totalPrice || 0,
    totalCommission: revenue._sum.commission || 0,
    recentBookings, recentGuides
  });
}
