import { prisma } from "@/lib/prisma";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const guides = await prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    orderBy: { avgRating: "desc" },
  });
  return <SearchClient guides={guides} />;
}
