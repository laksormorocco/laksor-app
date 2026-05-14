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
    include: { guide: true }
  });

  return NextResponse.json({ bookings });
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
