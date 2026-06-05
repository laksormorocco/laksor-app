"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Users, ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import { useExchangeRate } from "@/hooks/useExchangeRate";
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
  const { convert } = useExchangeRate();

  const CITIES = ["Marrakech", "Fès", "Essaouira", "Chefchaouen", "Agadir"];

  useEffect(() => {
    fetch("/api/experiences" + (city ? "?city=" + city : ""))
      .then(r => r.json())
      .then(d => { setTours(d.tours || []); setLoading(false); });
  }, [city]);

  return (
    <div className="min-h-screen bg-sand-200">
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300">
        <div className="h-14 flex items-center justify-between px-4">
          <Link href="/" className="font-display text-lg font-bold text-bronze-500 tracking-widest no-underline">LAKSOR</Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600">
            <MagnifyingGlass size={14} className="text-bronze-500" />
            Experiences
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-charcoal-800 mb-1">Experiences au Maroc</h1>
          <p className="text-sm text-charcoal-400">Choisissez votre experience, nous vous trouvons le guide ideal</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(city === c ? null : c)} className={"flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors " + (city === c ? "bg-bronze-500 text-white border-bronze-500" : "bg-white text-charcoal-600 border-sand-300")}>{c}</button>
          ))}
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
              <Link key={t.id} href={"/experiences/" + t.tourType.toLowerCase()}
                className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-sm no-underline block active:scale-[0.99] transition-all">
                <div className="relative h-52">
                  {t.coverImage
                    ? <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-sage-300/20 to-sand-300 flex items-center justify-center text-6xl">
                        {EMOJI[t.tourType] || "🧭"}
                      </div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  {t.guideCount > 0 && (
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
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-sand-300 rounded-xl text-xs font-bold text-charcoal-600 hover:border-sage-300 hover:text-sage-300 transition-colors mb-3">
                    {openId === t.id ? "Masquer ↑" : "Voir details ↓"}
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
                            {convert(priceWithCommission(t.minPrice))} <span className="text-xs font-normal text-charcoal-400">/ 2 pers.</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-charcoal-400">Prix sur demande</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 bg-sage-300 text-white font-bold px-4 py-2.5 rounded-full text-xs">
                      Voir les guides <ArrowRight size={12} weight="bold" />
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
