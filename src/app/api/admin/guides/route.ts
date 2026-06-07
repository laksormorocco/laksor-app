import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "PENDING";
  const guides = await prisma.guideProfile.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
  });
  return NextResponse.json({ guides });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, status, displayName, city, bio, languages, halfDayPrice, fullDayPrice, yearsExp, phone, avatar, userId, email } = body;
  const data: any = {};
  if (status) data.status = status;
  if (displayName) data.displayName = displayName;
  if (city !== undefined) data.city = city;
  if (bio !== undefined) data.bio = bio;
  if (languages) data.languages = languages;
  if (halfDayPrice) data.halfDayPrice = Number(halfDayPrice);
  if (fullDayPrice) data.fullDayPrice = Number(fullDayPrice);
  if (yearsExp !== undefined) data.yearsExp = Number(yearsExp);
  if (phone !== undefined) data.phone = phone;
  if (avatar) data.avatar = avatar;

  const guide = await prisma.guideProfile.update({ where: { id: String(id) }, data });

  // Mettre a jour email du user
  if (email && userId) {
    await prisma.user.update({ where: { id: String(userId) }, data: { email } }).catch(() => {});
  }

  return NextResponse.json({ guide });
}
