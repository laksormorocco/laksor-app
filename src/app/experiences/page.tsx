"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Users, ArrowRight, MagnifyingGlass, Percent, SealCheck, SlidersHorizontal, CaretDown, CaretUp } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import PriceDisplay from "@/components/PriceDisplay";
import { priceWithCommission } from "@/lib/pricing";

const EMOJI: Record<string,string> = {
  MEDINA_SECRETS:"🕌", GASTRONOMIE:"🍽️", HISTOIRE_MONUMENTS:"🏛️",
  DESERT_NATURE:"🏜️", SHOPPING_ARTISANAT:"🛍️", COUCHER_SOLEIL:"🌅", PHOTO_INSTAGRAM:"📸"
};

export default function ExperiencesPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string|null>(null);
  const [city, setCity] = useState<string|null>(null);
  const [sortBy, setSortBy] = useState<"popular"|"recent"|"price_asc"|"price_desc">("popular");
  const [showSort, setShowSort] = useState(false);
  const { convert } = useExchangeRate();

  const CITIES = ["Marrakech", "Fes", "Essaouira", "Chefchaouen", "Agadir"];

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    params.set("sort", sortBy);
    fetch("/api/experiences?" + params.toString())
      .then(r => r.json())
      .then(d => {
        let t = d.tours || [];
        if (sortBy === "price_asc") t = [...t].sort((a,b) => (a.minPrice||0) - (b.minPrice||0));
        if (sortBy === "price_desc") t = [...t].sort((a,b) => (b.minPrice||0) - (a.minPrice||0));
        if (sortBy === "recent") t = [...t].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
        setTours(t); setLoading(false);
      });
  }, [city, sortBy]);

  return (
    <div className="min-h-screen bg-sand-200">
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300">
        <div className="h-14 flex items-center justify-between px-4">
          <Link href="/" className="no-underline">
            <img src="/logo7.png" alt="Laksor" style={{ height: 32, width: "auto", objectFit: "contain", maxWidth: 110 }} />
          </Link>
          <div className="font-display text-sm font-bold text-charcoal-800">Experiences</div>
        </div>
      </div>

      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Experiences au Maroc</h1>
          <p className="text-sm text-charcoal-400">Choisissez votre experience, nous vous trouvons le guide ideal</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
            {["Marrakech","Fes","Essaouira","Chefchaouen","Agadir"].map(c => (
              <button key={c} onClick={() => setCity(city === c ? null : c)} className={"flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors " + (city === c ? "bg-bronze-500 text-white border-bronze-500" : "bg-white text-charcoal-600 border-sand-300")}>{c}</button>
            ))}
          </div>
          <div className="relative flex-shrink-0 ml-2">
            <button onClick={() => setShowSort(!showSort)}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (sortBy !== "popular" ? "bg-bronze-500 text-white border-bronze-500" : "bg-white text-charcoal-600 border-sand-300")}>
              <SlidersHorizontal size={12} weight="bold" />
              Trier
            </button>
            {showSort && (
              <div className="absolute right-0 top-9 bg-white rounded-2xl border border-sand-300 shadow-lg z-20 w-44 overflow-hidden">
                {[
                  {id:"popular", label:"Populaires"},
                  {id:"recent", label:"Plus recents"},
                  {id:"price_asc", label:"Prix croissant"},
                  {id:"price_desc", label:"Prix decroissant"},
                ].map(s => (
                  <button key={s.id} onClick={() => { setSortBy(s.id as any); setShowSort(false); }}
                    className={"w-full text-left px-4 py-3 text-xs font-semibold transition-colors " + (sortBy === s.id ? "text-bronze-500 bg-sand-100 font-bold" : "text-charcoal-700 hover:bg-sand-100")}>
                    {sortBy === s.id && "✓ "}{s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
            <div className="text-sm font-bold text-charcoal-800">Aucune experience disponible</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tours.map(t => (
              <Link key={t.id} href={t.isGuideExperience ? "/booking/" + t.guideId + "?expId=" + t.expId + "&tourPrice=" + Math.ceil(t.minPrice * 1.25) + (t.groupThreshold1 ? "&t1=" + t.groupThreshold1 + "&d1=" + t.groupDiscount1 : "") + (t.groupThreshold2 ? "&t2=" + t.groupThreshold2 + "&d2=" + t.groupDiscount2 : "") : "/experiences/" + t.tourType.toLowerCase()}
                className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-sm no-underline block active:scale-[0.99] transition-all">
                <div className="relative h-44">
                  {t.coverImage
                    ? <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-sage-300/20 to-sand-300 flex items-center justify-center text-6xl">
                        {EMOJI[t.tourType] || "🧭"}
                      </div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  {t.isGuideExperience && t.guideId === "cmq5fr4ef0002xbtvwrfquu46" && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-bronze-500 text-white rounded-full px-3 py-1.5 shadow-sm">
                      <SealCheck size={13} weight="fill" />
                      <span className="text-[11px] font-bold">Laksor</span>
                    </div>
                  )}
                  {t.guideCount > 0 && t.guideId !== "cmq5fr4ef0002xbtvwrfquu46" && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                      <span className="text-[11px] font-bold text-charcoal-800">{t.guideCount} guide{t.guideCount > 1 ? "s" : ""} disponible{t.guideCount > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display text-xl text-white font-bold mb-1.5">{t.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                        <Clock size={9} className="inline mr-1" />{t.duration}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                        <Users size={9} className="inline mr-1" />{t.groupSize}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {t.description && (
                    <p className="text-xs text-charcoal-400 leading-relaxed mb-3 line-clamp-2">{t.description}</p>
                  )}
                  {/* BOUTON DETAILS */}
                  <button onClick={(e) => { e.preventDefault(); setOpenId(openId === t.id ? null : t.id); }}
                    className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-charcoal-400 hover:text-charcoal-600 transition-colors mb-2">
                    {openId === t.id ? <><CaretUp size={10} /> Masquer</> : <><CaretDown size={10} /> Details inclus/exclus</>}
                  </button>

                  {/* ACCORDEON */}
                  {openId === t.id && (
                    <div className="mb-3 bg-sand-100 rounded-xl p-3 border border-sand-200">
                      {t.included?.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[9px] font-bold text-sage-300 uppercase tracking-widest mb-1">Inclus</div>
                          {t.included.map((item:string) => (
                            <div key={item} className="flex items-center gap-1.5 mb-1">
                              <span className="text-sage-300 text-xs font-bold">✓</span>
                              <span className="text-xs text-charcoal-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {t.itinerary?.length > 0 && (
                        <div className="mb-2">
                          <div className="text-[9px] font-bold text-bronze-500 uppercase tracking-widest mb-1">Itineraire</div>
                          {t.itinerary.map((step:any, i:number) => (
                            <div key={i} className="flex items-start gap-2 mb-1.5">
                              <span className="text-[9px] font-bold text-charcoal-400 flex-shrink-0 mt-0.5">{step.time}</span>
                              <div>
                                <div className="text-xs font-semibold text-charcoal-800">{step.title}</div>
                                {step.desc && <div className="text-[10px] text-charcoal-400">{step.desc}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {t.notIncluded?.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">Non inclus</div>
                          {t.notIncluded.map((item:string) => (
                            <div key={item} className="flex items-center gap-1.5 mb-1">
                              <span className="text-red-400 text-xs font-bold">✗</span>
                              <span className="text-xs text-charcoal-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      {t.minPrice ? (
                        <>
                          <div className="text-[10px] text-charcoal-400">A partir de</div>
                          <div className="font-display text-lg font-bold text-charcoal-800">
                <PriceDisplay mad={priceWithCommission(t.minPrice)} size="md" />
                {t.isGuideExperience && t.groupThreshold1 && (
  <span className="inline-flex items-center gap-1 bg-sage-300/10 text-sage-300 border border-sage-300/30 text-[10px] font-bold px-2 py-1 rounded-full mt-1">
    <Percent size={10} weight="bold" />
    -{t.groupDiscount1}% des {t.groupThreshold1} pers.
  </span>
)}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-charcoal-400">Prix sur demande</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-bronze-500 text-white font-bold px-4 py-2.5 rounded-full text-xs">
                      {t.isGuideExperience ? "Réserver maintenant" : "Voir les guides"} <ArrowRight size={12} weight="bold" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

