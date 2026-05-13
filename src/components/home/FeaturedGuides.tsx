// src/components/home/FeaturedGuides.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GuideCard } from "@/components/guide/GuideCard";

async function getFeaturedGuides() {
  return prisma.guideProfile.findMany({
    where: { status: "APPROVED" },
    orderBy: { avgRating: "desc" },
    take: 6,
    select: {
      id: true, displayName: true, avatar: true, city: true,
      languages: true, visitTypes: true, halfDayPrice: true,
      fullDayPrice: true, avgRating: true, totalReviews: true,
      yearsExp: true, bio: true,
    },
  });
}

export async function FeaturedGuides() {
  const guides = await getFeaturedGuides();

  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-terracotta font-semibold text-sm uppercase tracking-widest mb-2">
              Nos guides
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-majorelle">
              Guides recommandés
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 text-majorelle font-semibold text-sm hover:gap-3 transition-all"
          >
            Voir tous <ArrowRight size={16} />
          </Link>
        </div>

        {guides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Guides bientôt disponibles</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-majorelle font-semibold"
          >
            Voir tous les guides <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
