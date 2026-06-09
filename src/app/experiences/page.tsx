"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlass, SlidersHorizontal, Star, Clock, Users, ArrowRight, Percent, SealCheck, CaretDown, CaretUp, Heart } from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import PriceDisplay from "@/components/PriceDisplay";
import { priceWithCommission } from "@/lib/pricing";

const EMOJI: Record<string,string> = {
  MEDINA_SECRETS:"🕌", GASTRONOMIE:"🍽️", HISTOIRE_MONUMENTS:"🏛️",
  DESERT_NATURE:"🏜️", SHOPPING_ARTISANAT:"🛍️", COUCHER_SOLEIL:"🌅", PHOTO_INSTAGRAM:"📸"
};

const CITY_EMOJIS: Record<string,string> = {
  Marrakech:"🌹", Fes:"🕌", Essaouira:"🌊", Chefchaouen:"💙", Agadir:"🏖️"
};

const CATEGORIES = [
  {id:"all", icon:"✨", label:"Tous"},
  {id:"medina", icon:"🏛️", label:"Médina"},
  {id:"photo", icon:"📸", label:"Photo"},
  {id:"gastronomie", icon:"🍲", label:"Gastro"},
  {id:"art", icon:"🎨", label:"Art"},
  {id:"nature", icon:"🌄", label:"Nature"},
  {id:"desert", icon:"🐪", label:"Désert"},
];

export default function ExperiencesPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string|null>(null);
  const [city, setCity] = useState<string|null>(null);
  const [category, setCategory] = useState("all");
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
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>

      {/* NAVBAR */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5" style={{background:"rgba(246,241,232,0.88)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <Link href="/" className="no-underline flex items-center gap-2">
          <img src="/logo7.png" alt="Laksor" style={{height:32,width:"auto",objectFit:"contain",maxWidth:110}} />
        </Link>
        <span className="text-sm font-medium text-charcoal-800" style={{opacity:0.5}}>Experiences</span>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden" style={{height:260}}>
        <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80" alt="Maroc" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(17,11,4,0.72) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <div className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{color:"#B88A44",letterSpacing:2}}>Maroc Authentique</div>
          <h1 className="font-display text-3xl font-bold text-white mb-1.5" style={{lineHeight:1.2}}>Vivez le Maroc<br/>de l'intérieur</h1>
          <p className="text-sm text-white/70 mb-3">Guides certifiés · Expériences uniques</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" />
              {tours.length} expériences
            </div>
            <div className="text-xs text-white/80">🇲🇦 5 villes</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2 max-w-lg mx-auto">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 mb-4" style={{border:"1.5px solid #EADCC8", boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <MagnifyingGlass size={15} className="text-bronze-500 flex-shrink-0" />
          <span className="text-sm flex-1" style={{color:"rgba(17,17,17,0.4)"}}>Que voulez-vous découvrir ?</span>
          <div className="relative">
            <button onClick={() => setShowSort(!showSort)}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all " + (sortBy !== "popular" ? "bg-bronze-500 text-white" : "text-charcoal-600")}
              style={{background: sortBy !== "popular" ? "#B88A44" : "#EADCC8"}}>
              <SlidersHorizontal size={11} weight="bold" /> Trier
            </button>
            {showSort && (
              <div className="absolute right-0 top-9 bg-white rounded-2xl shadow-lg z-20 overflow-hidden" style={{width:176, border:"1px solid #EADCC8"}}>
                {[{id:"popular",label:"Populaires"},{id:"recent",label:"Plus récents"},{id:"price_asc",label:"Prix croissant"},{id:"price_desc",label:"Prix décroissant"}].map(s => (
                  <button key={s.id} onClick={() => { setSortBy(s.id as any); setShowSort(false); }}
                    className="w-full text-left px-4 py-3 text-xs font-medium transition-colors hover:bg-sand-100"
                    style={{color: sortBy === s.id ? "#B88A44" : "#111", fontWeight: sortBy === s.id ? 700 : 500}}>
                    {sortBy === s.id && "✓ "}{s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CITY FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{scrollbarWidth:"none"}}>
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(city === c ? null : c)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: city === c ? "#B88A44" : "white",
                color: city === c ? "white" : "#111",
                border: city === c ? "1.5px solid #B88A44" : "1.5px solid #EADCC8"
              }}>
              {CITY_EMOJIS[c] || ""} {c}
            </button>
          ))}
        </div>

        {/* SECTION HEADER */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-display text-lg font-semibold text-charcoal-800">
            {city ? "Experiences a " + city : "Toutes les experiences"}
          </span>
          <span className="text-xs text-charcoal-400">{tours.length} résultats</span>
        </div>

        {/* CARDS */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center" style={{border:"1px solid #EADCC8"}}>
            <div className="text-sm font-bold text-charcoal-800">Aucune experience disponible</div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {tours.map(t => (
              <Link key={t.id}
                href={t.isGuideExperience ? "/booking/" + t.guideId + "?expId=" + t.expId + "&tourPrice=" + Math.ceil(t.minPrice * 1.25) + (t.groupThreshold1 ? "&t1=" + t.groupThreshold1 + "&d1=" + t.groupDiscount1 : "") + (t.groupThreshold2 ? "&t2=" + t.groupThreshold2 + "&d2=" + t.groupDiscount2 : "") : "/experiences/" + (t.tourType||"").toLowerCase()}
                className="no-underline block active:scale-[0.98] transition-all"
                style={{background:"white", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.10)"}}>

                {/* IMAGE */}
                <div className="relative" style={{height:210}}>
                  {t.coverImage
                    ? <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-6xl" style={{background:"linear-gradient(135deg, rgba(125,143,105,0.15), rgba(246,241,232,0.8))"}}>{EMOJI[t.tourType] || "🧭"}</div>
                  }
                  <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)"}} />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3">
                    {t.isGuideExperience && t.guideId === "cmq5fr4ef0002xbtvwrfquu46" ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-[10px] font-bold" style={{background:"#B88A44"}}>
                        <SealCheck size={11} weight="fill" /> Laksor
                      </div>
                    ) : t.guideCount > 0 ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold" style={{background:"rgba(255,255,255,0.92)", color:"#7D8F69", backdropFilter:"blur(8px)"}}>
                        <div className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" />
                        {t.guideCount} guide{t.guideCount > 1 ? "s" : ""} dispo
                      </div>
                    ) : null}
                  </div>
                  <button onClick={e => e.preventDefault()} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)"}}>
                    <Heart size={14} className="text-charcoal-400" />
                  </button>

                  {/* Bottom image content */}
                  <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3.5">
                    <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{color:"#B88A44", letterSpacing:1.5}}>
                      {t.isGuideExperience ? "Experience" : (EMOJI[t.tourType] || "") + " Tour"}
                    </div>
                    <div className="font-display text-lg font-bold text-white mb-2" style={{lineHeight:1.2}}>{t.title}</div>
                    <div className="flex items-center gap-2">
                      {t.duration && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/90" style={{background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.2)"}}>⏱ {t.duration}</span>}
                      {t.groupSize && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/90" style={{background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.2)"}}>👥 {t.groupSize}</span>}
                    </div>
                  </div>
                </div>

                {/* GUIDE STRIP */}
                {t.guide && (
                  <div className="flex items-center justify-between px-3.5 py-3" style={{borderBottom:"1px solid #F0EDE7"}}>
                    <div className="flex items-center gap-2">
                      {t.guide.avatar
                        ? <img src={t.guide.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" style={{border:"2px solid #EADCC8"}} />
                        : <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:"linear-gradient(135deg, #B88A44, #8B6914)", border:"2px solid #EADCC8"}}>{t.guide.displayName?.[0]}</div>
                      }
                      <div>
                        <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">Guide</div>
                        <div className="text-xs font-semibold text-charcoal-800">{t.guide.displayName}</div>
                      </div>
                      <span className="text-[10px] font-semibold ml-1" style={{color:"#B88A44"}}>✦ Certifié</span>
                    </div>
                    {t.guide.avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={11} weight="fill" className="text-amber-400" />
                        <span className="text-xs font-bold text-charcoal-800">{Number(t.guide.avgRating).toFixed(1)}</span>
                        <span className="text-[10px] text-charcoal-400">({t.guide.totalReviews})</span>
                      </div>
                    )}
                  </div>
                )}

                {/* BOTTOM */}
                <div className="px-3.5 py-3">
                  <div className="flex items-end justify-between mb-2.5">
                    <div>
                      <div className="text-[10px] text-charcoal-400 mb-0.5">A partir de</div>
                      {t.minPrice ? (
                        <>
                          <div className="font-display text-xl font-bold text-charcoal-800">
                            <PriceDisplay mad={priceWithCommission(t.minPrice)} size="md" />
                          </div>
                          <div className="text-[10px] text-charcoal-400 mt-0.5">
                            {t.isGuideExperience ? ("/ pers." + (t.groupThreshold1 ? " -" + t.groupDiscount1 + "% des " + t.groupThreshold1 + " pers." : "")) : "/ groupe · 1-4 pers."}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-charcoal-400">Prix sur demande</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-bold px-4 py-2.5 rounded-full text-xs no-underline"
                      style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
                      {t.isGuideExperience ? "Réserver" : "Voir les guides"} <ArrowRight size={11} weight="bold" />
                    </div>
                  </div>

                  {/* DETAILS TOGGLE */}
                  {(t.included?.length > 0 || t.notIncluded?.length > 0 || t.itinerary?.length > 0) && (
                    <>
                      <button onClick={(e) => { e.preventDefault(); setOpenId(openId === t.id ? null : t.id); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold transition-all"
                        style={{background:"rgba(246,241,232,0.6)", border:"1px solid #EADCC8", color:"rgba(17,17,17,0.55)"}}>
                        {openId === t.id ? <><CaretUp size={11} weight="bold" /> Masquer le programme</> : <><CaretDown size={11} weight="bold" /> Programme & Inclus</>}
                      </button>

                      {openId === t.id && (
                        <div className="mt-3 rounded-xl p-3 flex flex-col gap-3" style={{background:"rgba(246,241,232,0.5)", border:"1px solid #EADCC8"}}>
                          {t.itinerary?.length > 0 && (
                            <div>
                              <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:"#B88A44"}}>Programme</div>
                              {t.itinerary.map((step:any, i:number) => (
                                <div key={i} className="flex gap-2.5 mb-2 last:mb-0">
                                  <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{background:"#7D8F69"}}>{i+1}</div>
                                    {i < t.itinerary.length-1 && <div className="w-px flex-1 my-1" style={{background:"rgba(125,143,105,0.3)"}} />}
                                  </div>
                                  <div className="flex-1 pb-1">
                                    {step.time && <div className="text-[9px] font-bold mb-0.5" style={{color:"#B88A44"}}>{step.time}</div>}
                                    <div className="text-xs font-semibold text-charcoal-800">{step.title}</div>
                                    {step.desc && <div className="text-[10px] text-charcoal-400 mt-0.5">{step.desc}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {(t.included?.length > 0 || t.notIncluded?.length > 0) && (
                            <div className="grid grid-cols-2 gap-2">
                              {t.included?.length > 0 && (
                                <div className="bg-white rounded-xl p-2.5" style={{border:"1px solid rgba(125,143,105,0.2)"}}>
                                  <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{color:"#7D8F69"}}>Inclus</div>
                                  {t.included.map((item:string) => (
                                    <div key={item} className="flex items-start gap-1 mb-1">
                                      <span className="text-xs font-bold flex-shrink-0" style={{color:"#7D8F69"}}>✓</span>
                                      <span className="text-[10px] text-charcoal-600">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {t.notIncluded?.length > 0 && (
                                <div className="bg-white rounded-xl p-2.5" style={{border:"1px solid rgba(239,68,68,0.15)"}}>
                                  <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5 text-red-400">Non inclus</div>
                                  {t.notIncluded.map((item:string) => (
                                    <div key={item} className="flex items-start gap-1 mb-1">
                                      <span className="text-xs font-bold text-red-400 flex-shrink-0">✗</span>
                                      <span className="text-[10px] text-charcoal-600">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
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
