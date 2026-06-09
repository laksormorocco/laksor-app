// src/components/guide/GuideCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import { formatPrice, getInitials } from "@/lib/utils";
import type { GuideCard as GuideCardType } from "@/types";

interface Props {
  guide: GuideCardType;
}

const VISIT_LABELS: Record<string, string> = {
  CULINAIRE: "Food Tour",
  SHOPPING: "Shopping",
  MONUMENTS: "Monuments",
  HISTOIRE: "Histoire",
  AVENTURE: "Aventure",
  DESERT: "Désert",
  ARTISANAT: "Artisanat",
  EXPERIENCE_LOCALE: "Local",
  NIGHTLIFE: "Nightlife",
  PHOTOGRAPHIE: "Photo",
};

export function GuideCard({ guide }: Props) {
  return (
    <Link href={`/guide/${guide.slug || guide.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-sand-200 hover:border-majorelle/30 hover:shadow-xl transition-all duration-300 card-hover">
        {/* Avatar */}
        <div className="relative h-52 bg-sand-200 overflow-hidden">
          {guide.avatar ? (
            <Image
              src={guide.avatar}
              alt={guide.displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-majorelle to-majorelle-700">
              <span className="text-4xl font-bold text-white font-display">
                {getInitials(guide.displayName)}
              </span>
            </div>
          )}
          {/* Rating badge */}
          {guide.avgRating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 rounded-full px-2 py-1 shadow">
              <Star size={12} className="text-safran fill-safran" />
              <span className="text-xs font-bold text-gray-800">
                {guide.avgRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
            {guide.displayName}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin size={13} className="text-terracotta shrink-0" />
            <span className="truncate">{guide.city}</span>
            {guide.yearsExp > 0 && (
              <>
                <span className="mx-1">·</span>
                <Clock size={13} className="shrink-0" />
                <span>{guide.yearsExp} ans exp.</span>
              </>
            )}
          </div>

          {/* Visit types */}
          <div className="flex flex-wrap gap-1 mb-4">
            {guide.visitTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="text-xs px-2 py-0.5 rounded-full bg-majorelle/10 text-majorelle font-medium"
              >
                {VISIT_LABELS[type] ?? type}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t border-sand-200">
            <div>
              <p className="text-xs text-gray-400">À partir de</p>
              <p className="font-bold text-majorelle text-base">
                {formatPrice(guide.halfDayPrice)}
                <span className="text-xs font-normal text-gray-400"> / 4h</span>
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-majorelle text-white font-medium group-hover:bg-majorelle-600 transition-colors">
              Voir profil →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
