import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function filterMessage(content: string): string {
  return content
    .replace(/(\+?\d[\d\s\-\.]{7,}\d)/g, "*** [numéro masqué] ***")
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "*** [email masqué] ***")
    .replace(/(wa\.me|whatsapp|telegram|instagram|facebook|snapchat)/gi, "*** [lien masqué] ***");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return NextResponse.json({ error: "bookingId requis" }, { status: 400 });
    const messages = await prisma.message.findMany({
      where: { bookingId },
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json({ messages });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { bookingId, senderId, senderRole, content } = await req.json();
    if (!bookingId || !senderId || !senderRole || !content) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    const filtered = filterMessage(content.trim());
    const message = await prisma.message.create({
      data: { bookingId, senderId, senderRole, content: filtered }
    });
    return NextResponse.json({ message });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
