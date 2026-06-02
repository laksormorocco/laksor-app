import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supabaseId, email, displayName, phone, city, bio, vehicleType, vehicleModel, capacity, halfDayPrice, fullDayPrice, airportPrice } = body;

    const user = await prisma.user.update({
      where: { supabaseId },
      data: { role: "TRANSPORT" }
    });

    const profile = await prisma.transportProfile.create({
      data: {
        userId: user.id,
        displayName,
        phone,
        city,
        bio,
        vehicleType,
        vehicleModel,
        capacity: parseInt(capacity),
        halfDayPrice: parseFloat(halfDayPrice),
        fullDayPrice: parseFloat(fullDayPrice),
        airportPrice: parseFloat(airportPrice),
        status: "PENDING"
      }
    });

    return NextResponse.json({ profile });
  } catch(e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
