import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — liste tous les templates
export async function GET() {
  try {
    const templates = await prisma.tourTemplate.findMany({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json({ templates });
  } catch (e) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// POST — créer un template
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tourType, title, description, duration, groupSize, difficulty, bestMoment, coverImage, tags, included, notIncluded } = body;

    const template = await prisma.tourTemplate.create({
      data: {
        tourType,
        title,
        description,
        duration:    duration    || "4h",
        groupSize:   groupSize   || "1-6 pers.",
        difficulty:  difficulty  || "Facile",
        bestMoment:  bestMoment  || "Matin",
        coverImage:  coverImage  || null,
        tags:        tags        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        included:    included    ? included.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        notIncluded: notIncluded ? notIncluded.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        isActive:    true,
      }
    });
    return NextResponse.json({ template });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH — modifier un template
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive, title, description, duration, groupSize, difficulty, bestMoment, coverImage, tags, included, notIncluded } = body;

    const data: any = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (title)       data.title       = title;
    if (description) data.description = description;
    if (duration)    data.duration    = duration;
    if (groupSize)   data.groupSize   = groupSize;
    if (difficulty)  data.difficulty  = difficulty;
    if (bestMoment)  data.bestMoment  = bestMoment;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (tags)        data.tags        = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    if (included)    data.included    = included.split(",").map((t: string) => t.trim()).filter(Boolean);
    if (notIncluded) data.notIncluded = notIncluded.split(",").map((t: string) => t.trim()).filter(Boolean);

    const template = await prisma.tourTemplate.update({ where: { id }, data });
    return NextResponse.json({ template });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
