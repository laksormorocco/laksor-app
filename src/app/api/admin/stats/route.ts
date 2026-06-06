import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const [totalGuides, pendingGuides, approvedGuides, totalBookings, pendingBookings, confirmedBookings, cancelledBookings, totalUsers] = await Promise.all([
    prisma.guideProfile.count(),
    prisma.guideProfile.count({ where: { status: "PENDING" } }),
    prisma.guideProfile.count({ where: { status: "APPROVED" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.user.count(),
  ]);

  const revenue = await prisma.booking.aggregate({
    where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    _sum: { totalPrice: true, commission: true }
  });

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      guide: { select: { id:true, displayName:true, city:true, avatar:true, phone:true } },
      tourist: { select: { id:true, name:true, email:true } }
    }
  });

  const recentGuides = await prisma.guideProfile.findMany({ where: { status: "PENDING", displayName: { not: null } },
    take: 5,
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id:true, email:true } } }
  });

  // Revenus par mois
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const bookingsByMonth = await prisma.booking.findMany({
    where: { createdAt: { gte: sixMonthsAgo }, status: { in: ["CONFIRMED","COMPLETED"] } },
    select: { totalPrice: true, createdAt: true }
  });
  const months = ["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Aou","Sep","Oct","Nov","Dec"];
  const monthlyMap: Record<string, number> = {};
  bookingsByMonth.forEach((b: any) => {
    const key = months[new Date(b.createdAt).getMonth()];
    monthlyMap[key] = (monthlyMap[key] || 0) + Number(b.totalPrice);
  });
  const monthlyRevenue = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

  // Revenu par guide (top 10)
  const guideRevenues = await prisma.booking.groupBy({
    by: ["guideId"],
    where: { status: { in: ["CONFIRMED","COMPLETED"] } },
    _sum: { totalPrice: true },
    _count: { id: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 10,
  });

  const guideIds = guideRevenues.map(g => g.guideId);
  const guideProfiles = await prisma.guideProfile.findMany({
    where: { id: { in: guideIds } },
    select: { id: true, displayName: true, city: true, avatar: true }
  });

  const topGuides = guideRevenues.map(g => {
    const profile = guideProfiles.find(p => p.id === g.guideId);
    return {
      guideId: g.guideId,
      displayName: profile?.displayName || "Guide",
      city: profile?.city || "",
      avatar: profile?.avatar || null,
      revenue: Number(g._sum.totalPrice || 0),
      bookings: g._count.id,
    };
  });

  // Taux de conversion
  const conversionRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

  return NextResponse.json({
    totalGuides, pendingGuides, approvedGuides,
    totalBookings, pendingBookings, confirmedBookings, cancelledBookings,
    totalUsers,
    totalRevenue: revenue._sum.totalPrice || 0,
    totalCommission: revenue._sum.commission || 0,
    recentBookings, recentGuides, monthlyRevenue,
    topGuides, conversionRate,
  });
}
