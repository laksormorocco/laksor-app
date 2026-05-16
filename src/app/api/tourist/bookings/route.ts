import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabaseId = url.searchParams.get("supabaseId");
  if (!supabaseId) return NextResponse.json({ bookings: [] });

  const user = await prisma.user.findUnique({ where: { supabaseId } });
  if (!user) return NextResponse.json({ bookings: [] });

  const bookings = await prisma.booking.findMany({
    where: { touristId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      guide: {
        select: { id:true, displayName:true, city:true, avatar:true, phone:true, halfDayPrice:true, fullDayPrice:true }
      },
      slots: true
    }
  });

  const formatted = bookings.map((b: any) => ({
    ...b,
    date: b.slots?.[0]?.date || b.createdAt,
    persons: b.slots?.[0]?.persons || 1,
  }));

  return NextResponse.json({ bookings: formatted });
}

export async function PATCH(req: Request) {
  try {
    const { bookingId, status } = await req.json();
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });
    return NextResponse.json({ booking });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
