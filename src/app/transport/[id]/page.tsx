export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TransportPageClient from "./TransportPageClient";

export default async function TransportDetailPage({ params }: { params: { id: string } }) {
  const transport = await prisma.transportProfile.findUnique({
    where: { id: params.id },
    include: { user: true }
  });

  if (!transport) notFound();

  const reviews = await prisma.review.findMany({
    where: { transportId: params.id },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return <TransportPageClient transport={{ ...transport, reviews }} />;
}
