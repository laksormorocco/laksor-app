export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GuidePageClient from "@/components/GuidePageClient";

export default async function GuidePage({ params }: { params: { id: string } }) {
  const guide = await prisma.guideProfile.findUnique({
    where: { id: params.id },
    include: { user: true, tours: { where: { isActive: true }, include: { template: true } } }
  });
  if (!guide) notFound();

  const experiences = await prisma.guideExperience.findMany({
    where: { guideId: params.id, isActive: true, status: "APPROVED" }
  });

  const reviews = await prisma.review.findMany({
    where: { guideId: params.id },
    include: { author: true },
    take: 10,
    orderBy: { createdAt: "desc" }
  });

  return <GuidePageClient guide={{...guide, reviews, experiences}} />;
}
