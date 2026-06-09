import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import GuidePageClient from "@/components/GuidePageClient";

export default async function GuideBySlugPage({ params }: { params: { slug: string } }) {
  const guide = await prisma.guideProfile.findUnique({
    where: { slug: params.slug },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      tours: { include: { template: true }, where: { isActive: true } },
      reviews: { include: { author: { select: { name: true, avatar: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      experiences: { where: { isActive: true, status: "APPROVED" } },
    }
  });

  if (!guide) notFound();

  const data = {
    ...guide,
    avatar: guide.user?.avatar ?? null,
    displayName: guide.user?.name ?? guide.displayName,
  };

  return <GuidePageClient guide={data} />;
}
