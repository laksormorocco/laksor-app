import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { guides } = body;
  
  if (!guides || !Array.isArray(guides)) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const results = [];
  const errors = [];

  for (const g of guides) {
    try {
      const displayName = [g.prenom, g.nom].filter(Boolean).join(" ").trim();
      const email = g.email || (displayName.toLowerCase().replace(/\s+/g, ".") + "@laksor-import.ma");
      const languages = g.langues ? g.langues.split(/[,;\/]/).map((l: string) => l.trim()).filter(Boolean) : [];

      // Creer user fictif
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          supabaseId: "import_" + Date.now() + "_" + Math.random().toString(36).slice(2),
          email,
          name: displayName,
          role: "GUIDE",
        }
      });

      // Creer profil guide
      const guide = await prisma.guideProfile.upsert({
        where: { userId: user.id },
        update: { displayName, city: g.ville || "", languages },
        create: {
          userId: user.id,
          displayName,
          city: g.ville || "",
          languages,
          status: "PENDING",
          halfDayPrice: 350,
          fullDayPrice: 650,
        }
      });

      results.push({ name: displayName, id: guide.id });
    } catch (e: any) {
      errors.push({ name: g.nom, error: e.message });
    }
  }

  return NextResponse.json({ created: results.length, errors, results });
}
