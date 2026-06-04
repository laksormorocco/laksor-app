import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";

  const tourists = await prisma.user.findMany({
    where: {
      role: "TOURIST",
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      } : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        include: {
          guide: { select: { displayName: true, city: true } }
        }
      }
    }
  });

  const enriched = tourists.map(t => ({
    ...t,
    totalBookings: t.bookings.length,
    totalSpent: t.bookings
      .filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + Number(b.totalPrice), 0),
    lastBooking: t.bookings[0] || null,
  }));

  return NextResponse.json({ tourists: enriched });
}
