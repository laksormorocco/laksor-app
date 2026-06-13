import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ conversations: [] });

    // Trouver tous les bookings liés à cet utilisateur
    const user = await prisma.user.findUnique({
      where: { supabaseId: userId },
      select: { id: true, role: true, name: true }
    });

    if (!user) return NextResponse.json({ conversations: [] });

    let bookings: any[] = [];

    if (user.role === "GUIDE") {
      const guide = await prisma.guideProfile.findFirst({
        where: { userId: user.id },
        select: { id: true }
      });
      if (guide) {
        bookings = await prisma.booking.findMany({
          where: { guideId: guide.id },
          include: {
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
            tourist: { select: { name: true } }
          },
          orderBy: { createdAt: "desc" }
        });
      }
    } else {
      bookings = await prisma.booking.findMany({
        where: { touristId: user.id },
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
          guide: { select: { displayName: true } }
        },
        orderBy: { createdAt: "desc" }
      });
    }

    const conversations = bookings
      .filter((b: any) => b.messages.length > 0)
      .map((b: any) => {
        const lastMsg = b.messages[0];
        const unread = b.messages.filter((m: any) => !m.read && m.senderId !== userId).length;
        const ref = b.notes?.match(/REF:([A-Z0-9-]+)/)?.[1] || b.id.slice(0,8);
        return {
          bookingId: b.id,
          bookingRef: ref,
          otherName: user.role === "GUIDE" ? b.tourist?.name : b.guide?.displayName,
          lastMessage: lastMsg.content,
          lastMessageAt: lastMsg.createdAt,
          unread
        };
      });

    return NextResponse.json({ conversations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, conversations: [] });
  }
}
