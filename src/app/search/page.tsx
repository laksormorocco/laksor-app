export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SearchClient from "@/components/SearchClient";

export default async function SearchPage() {
  const guides = await prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    orderBy: { avgRating: "desc" },
    take: 50,
  });

  return <SearchClient guides={guides} />;
}
