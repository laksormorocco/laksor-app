import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, displayName, phone, city, description, supabaseId } = body;

    if (!email || !displayName || !phone || !city) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const existing = await prisma.provider.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email deja utilise" }, { status: 400 });
    }

    const provider = await prisma.provider.create({
      data: { email, displayName, phone, city, description, supabaseId, status: "PENDING" }
    });

    return NextResponse.json({ provider });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
