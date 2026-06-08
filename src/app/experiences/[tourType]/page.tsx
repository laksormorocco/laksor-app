"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Star, ArrowLeft, Users, Clock } from "@phosphor-icons/react";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import PriceDisplay from "@/components/PriceDisplay";
import { priceWithCommission } from "@/lib/pricing";

export default function ExperienceGuidesPage() {
  const params = useParams();
  const tourType = (params.tourType as string).toUpperCase();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { convert } = useExchangeRate();

  useEffect(() => {
    fetch("/api/experiences/" + tourType)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [tourType]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sand-200">
      <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tour = data?.tour;
  const guides = data?.guides || [];

  return (
    <div className="min-h-screen bg-sand-200">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 h-14 flex items-center gap-3 px-4">
        <Link href="/experiences" className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center no-underline">
          <ArrowLeft size={16} className="text-charcoal-600" />
        </Link>
        <span className="font-display text-base font-bold text-charcoal-800 truncate">{tour?.title}</span>
      </div>

      <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">

        {/* TOUR INFO */}
        {tour && (
          <div className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-sm mb-5">
            {tour.coverImage && (
              <div className="relative h-44">
                <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="font-display text-xl text-white font-bold">{tour.title}</div>
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex gap-3 mb-2">
                <span className="flex items-center gap-1 text-xs text-charcoal-400"><Clock size={11} /> {tour.duration}</span>
                <span className="flex items-center gap-1 text-xs text-charcoal-400"><Users size={11} /> {tour.groupSize}</span>
                <span className="text-xs text-charcoal-400">🚶 {tour.difficulty}</span>
              </div>
              {tour.description && <p className="text-xs text-charcoal-400 leading-relaxed">{tour.description}</p>}
            </div>
          </div>
        )}

        {/* TITRE LISTE */}
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-charcoal-800">{guides.length} guide{guides.length > 1 ? "s" : ""} propose{guides.length > 1 ? "nt" : ""} cette experience</h2>
          <p className="text-xs text-charcoal-400 mt-0.5">Choisissez votre guide et reservez directement</p>
        </div>

        {/* LISTE GUIDES */}
        {guides.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
            <div className="text-4xl mb-3">🧭</div>
            <div className="text-sm font-bold text-charcoal-800 mb-1">Aucun guide disponible</div>
            <div className="text-xs text-charcoal-400">Revenez bientot</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {guides.map((g: any) => (
              <div key={g.guideId} className="bg-white rounded-2xl border border-sand-300 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Link href={"/guide/" + g.guideId} className="flex-shrink-0 no-underline">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-300">
                      {g.guide.avatar
                        ? <img src={g.guide.avatar} className="w-full h-full object-cover" alt={g.guide.displayName} />
                        : <div className="w-full h-full flex items-center justify-center font-display text-xl font-bold text-charcoal-500">{g.guide.displayName?.[0]}</div>
                      }
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={"/guide/" + g.guideId} className="no-underline">
                      <div className="font-display text-sm font-bold text-charcoal-800">{g.guide.displayName}</div>
                    </Link>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-charcoal-400" />
                      <span className="text-xs text-charcoal-400">{g.guide.city}</span>
                    </div>
                    {g.guide.avgRating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} weight="fill" className="text-amber-400" />
                        <span className="text-xs font-bold text-charcoal-800">{Number(g.guide.avgRating).toFixed(1)}</span>
                        <span className="text-xs text-charcoal-400">({g.guide.totalReviews} avis)</span>
                      </div>
                    )}
                    {g.guide.languages?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {g.guide.languages.slice(0,4).map((l:string) => (
                          <span key={l} className="text-sm" title={l}>
                            {l==="Francais"||l==="Français"?"🇫🇷":l==="Anglais"?"🇬🇧":l==="Arabe"?"🇲🇦":l==="Espagnol"?"🇪🇸":l==="Allemand"?"🇩🇪":l==="Russe"?"🇷🇺":l==="Hebreu"?"🇮🇱":l==="Portugais"?"🇵🇹":l==="Chinois"?"🇨🇳":"🌍"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-charcoal-400">Prix</div>
                    <div className="font-display text-lg font-bold text-charcoal-800">{convert(g.price)}</div>
                    <div className="text-[10px] text-charcoal-400">/ 4 pers. max</div>
                  </div>
                </div>
                <a href={"/booking/" + g.guideId + "?tourId=" + g.templateId + "&tourPrice=" + Math.ceil((g.price || g.halfDayPrice || 350) * 1.25)}
                  className="w-full flex items-center justify-center gap-2 bg-sage-300 hover:bg-sage-400 text-white font-bold py-3 rounded-full text-sm no-underline transition-colors">
                  Reserver avec {g.guide.displayName.split(" ")[0]}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
