"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MagnifyingGlass, SlidersHorizontal, Star, ArrowRight, SealCheck, CaretDown, CaretUp, Heart, Users, Lock, CaretLeft, CaretRight } from "@phosphor-icons/react";
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
  const [selectedType, setSelectedType] = useState<Record<string,"group"|"private">>({});
  const [photoIdx, setPhotoIdx] = useState<Record<string,number>>({});
  const [showInfo, setShowInfo] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [animatedId, setAnimatedId] = useState<string|null>(null);
  const { convert } = useExchangeRate();

  const CITIES = ["Marrakech", "Fes", "Essaouira", "Chefchaouen", "Agadir"];

  // Hero photos = toutes les photos des expériences chargées
  const heroPhotos = tours.flatMap(t => t.photos || []).filter(Boolean).slice(0, 8);

  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % heroPhotos.length), 4000);
    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    params.set("sort", sortBy);
    if (category && category !== "all") params.set("category", category);
    fetch("/api/experiences?" + params.toString())
      .then(r => r.json())
      .then(d => {
        let t = d.tours || [];
        if (sortBy === "price_asc") t = [...t].sort((a,b) => (a.minPrice||0) - (b.minPrice||0));
        if (sortBy === "price_desc") t = [...t].sort((a,b) => (b.minPrice||0) - (a.minPrice||0));
        if (sortBy === "recent") t = [...t].sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
        setTours(t); setLoading(false);
      });
  }, [city, sortBy, category]);

  return (
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>

      {/* NAVBAR AIRBNB STYLE */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-2.5" style={{background:"rgba(246,241,232,0.92)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <Link href="/" className="no-underline flex-shrink-0">
          <img src="/logo7.png" alt="Laksor" style={{height:28,width:"auto",objectFit:"contain",maxWidth:80}} />
        </Link>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 h-10" style={{border:"1.5px solid #EADCC8", boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          <MagnifyingGlass size={14} className="text-bronze-500 flex-shrink-0" />
          <input readOnly placeholder="Que voulez-vous découvrir ?" className="flex-1 text-xs bg-transparent outline-none" style={{color:"rgba(17,17,17,0.5)"}} />
          <button onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={{background:"#EADCC8", color:"#111"}}>
            <SlidersHorizontal size={10} weight="bold" /> Trier
          </button>
        </div>
      </div>

      {/* HERO — carousel dynamique */}
      <div className="relative overflow-hidden" style={{height:190}}>
        {heroPhotos.length > 0 ? (
          <>
            {heroPhotos.map((photo, i) => (
              <img key={i} src={photo} alt="Expérience Laksor"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{opacity: i === heroIdx ? 1 : 0}} />
            ))}
            {/* Dots */}
            {heroPhotos.length > 1 && (
              <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1 z-10">
                {heroPhotos.map((_, i) => (
                  <button key={i} onClick={() => setHeroIdx(i)}
                    className={"rounded-full transition-all " + (i === heroIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50")} />
                ))}
              </div>
            )}
          </>
        ) : (
          <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80" alt="Maroc" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.82) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{color:"rgba(255,255,255,0.9)",letterSpacing:2, textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>✦ Maroc Authentique</div>
          <h1 className="font-display text-3xl font-bold text-white mb-1.5" style={{lineHeight:1.2}}>Vivez le Maroc<br/>de l'intérieur</h1>
          <p className="text-sm text-white/70 mb-3">Guides certifiés · Expériences uniques</p>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs" style={{color:"rgba(255,255,255,0.85)"}}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#4ade80", boxShadow:"0 0 6px #4ade80"}} />
              {tours.length} expériences
            </div>
            <div className="text-xs" style={{color:"rgba(255,255,255,0.85)"}}>🇲🇦 5 villes</div>
          </div>

        </div>
      </div>

      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">

        {showSort && (
          <div className="absolute right-4 top-14 bg-white rounded-2xl shadow-lg z-50 overflow-hidden" style={{width:176, border:"1px solid #EADCC8"}}>
            {[{id:"popular",label:"Populaires"},{id:"recent",label:"Plus récents"},{id:"price_asc",label:"Prix croissant"},{id:"price_desc",label:"Prix décroissant"}].map(s => (
              <button key={s.id} onClick={() => { setSortBy(s.id as any); setShowSort(false); }}
                className="w-full text-left px-4 py-3 text-xs font-medium"
                style={{color: sortBy === s.id ? "#B88A44" : "#111", fontWeight: sortBy === s.id ? 700 : 500}}>
                {sortBy === s.id && "✓ "}{s.label}
              </button>
            ))}
          </div>
        )}

        {/* CITY FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{scrollbarWidth:"none"}}>
          {[{name:"Toutes",emoji:"✨"},{name:"Marrakech",emoji:"🌹"},{name:"Fes",emoji:"🕌"},{name:"Essaouira",emoji:"🌊"},{name:"Chefchaouen",emoji:"💙"},{name:"Agadir",emoji:"🏖️"}].map(c => (
            <button key={c.name} onClick={() => setCity(c.name === "Toutes" ? null : (city === c.name ? null : c.name))}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: (c.name === "Toutes" && !city) || city === c.name ? "#111111" : "white",
                color: (c.name === "Toutes" && !city) || city === c.name ? "white" : "#111",
                border: (c.name === "Toutes" && !city) || city === c.name ? "1.5px solid #111" : "1.5px solid #EADCC8"
              }}>
              <span>{c.emoji}</span> {c.name}
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
                href={t.isGuideExperience ? "/booking/" + t.guideId + "?expId=" + t.expId + "&bookingType=" + (selectedType[t.id]||"group") + "&tourPrice=" + Math.ceil((selectedType[t.id]==="private" && t.privatePricePerPerson ? t.privatePricePerPerson : t.minPrice) * 1.25) : "/experiences/" + (t.tourType||"").toLowerCase()}
                className="no-underline block active:scale-[0.98] transition-all"
                style={{background:"white", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.10)"}}>

                {/* IMAGE CAROUSEL */}
                <div className="relative overflow-hidden" style={{height:220}}>
                  {/* Photos carousel */}
                  {t.photos?.length > 0 ? (
                    <>
                      <div className="flex h-full transition-transform duration-500 ease-out"
                        style={{transform:`translateX(-${(photoIdx[t.id]||0)*100}%)`}}>
                        {t.photos.map((photo:string, pi:number) => (
                          <img key={pi} src={photo} alt={t.title}
                            className="w-full h-full object-cover flex-shrink-0" style={{minWidth:"100%"}} />
                        ))}
                      </div>
                      {t.photos.length > 1 && (
                        <>
                          <button onClick={e => { e.preventDefault(); setPhotoIdx(prev => ({...prev, [t.id]: Math.max(0, (prev[t.id]||0)-1)})); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center z-10"
                            style={{background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)"}}>
                            <CaretLeft size={12} weight="bold" className="text-charcoal-800" />
                          </button>
                          <button onClick={e => { e.preventDefault(); setPhotoIdx(prev => ({...prev, [t.id]: Math.min(t.photos.length-1, (prev[t.id]||0)+1)})); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center z-10"
                            style={{background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)"}}>
                            <CaretRight size={12} weight="bold" className="text-charcoal-800" />
                          </button>
                          <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 z-10">
                            {t.photos.map((_:any, pi:number) => (
                              <div key={pi} className={"w-1.5 h-1.5 rounded-full transition-all " + ((photoIdx[t.id]||0) === pi ? "bg-white scale-125" : "bg-white/50")} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : t.coverImage ? (
                    <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl" style={{background:"linear-gradient(135deg, rgba(125,143,105,0.15), rgba(246,241,232,0.8))"}}>{EMOJI[t.tourType] || "🧭"}</div>
                  )}
                  <div className="absolute inset-0" style={{background:"linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.72) 100%)"}} />

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

                  {/* TITRE EN HAUT */}
                  <div className="absolute top-12 left-0 right-0 px-3.5">
                    <div className="font-display text-lg font-bold text-white" style={{lineHeight:1.2, textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>{t.title}</div>
                  </div>
                  {/* BAS IMAGE — infos + bouton desc */}
                  <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {t.duration && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/90" style={{background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.2)"}}>⏱ {t.duration}</span>}
                        {t.groupSize && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/90" style={{background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.2)"}}>👥 {t.groupSize}</span>}
                        {t.languages?.slice(0,2).map((l:string) => <span key={l} className="text-sm leading-none">{l==="Français"?"🇫🇷":l==="Anglais"?"🇬🇧":l==="Espagnol"?"🇪🇸":l==="Allemand"?"🇩🇪":l==="Arabe"?"🇲🇦":l==="Italien"?"🇮🇹":l==="Russe"?"🇷🇺":"🏳️"}</span>)}
                      </div>
                      {t.description && (
                        <button onClick={e => { e.preventDefault(); setOpenId(openId === t.id ? null : t.id); }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
                          style={{background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.3)"}}>
                          📖 Desc.
                        </button>
                      )}
                    </div>
                    {openId === t.id && t.description && (
                      <div className="mt-2 p-2.5 rounded-xl text-[11px] leading-relaxed" style={{background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", color:"rgba(255,255,255,0.9)"}}>
                        {t.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* GUIDE STRIP — seulement pour les tours guides, pas les expériences Laksor */}
                {t.guide && t.guideId !== "cmq5fr4ef0002xbtvwrfquu46" && (
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

                {/* LANGUES + CRENEAUX */}
                {/* BOTTOM */}
                <div className="px-3.5 py-3">
                  {/* TOGGLE GROUPE / PRIVE */}
            {t.privatePricePerPerson && (<>
                    <div className="flex gap-2 mb-3 p-1 rounded-full bg-sand-100" style={{border:"1px solid #EADCC8"}}>
                      <button onClick={e => { e.preventDefault(); setSelectedType(prev => ({...prev, [t.id]: "group"})); }}
                        className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all " + ((selectedType[t.id]||"group") === "group" ? "bg-bronze-500 text-white shadow-sm" : "text-charcoal-500")}>
                        <Users size={12} weight="bold" /> Groupe
                      </button>
                      <button onClick={e => { e.preventDefault(); setSelectedType(prev => ({...prev, [t.id]: "private"})); }}
                        className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all " + (selectedType[t.id] === "private" ? "bg-charcoal-800 text-white shadow-sm" : "text-charcoal-500")}>
                        <Lock size={12} weight="bold" /> Privé
                      </button>
                    </div>
                    <button onClick={e => { e.preventDefault(); setShowInfo(true); }}
                      className="text-[10px] text-charcoal-400 underline text-center w-full mt-1 mb-1">
                      Quelle différence ?
                    </button>
            </>)}
                  <div className="flex items-end justify-between mb-2.5">
                    <div>
                      <div className="text-[10px] text-charcoal-400 mb-0.5">À partir de</div>
                      {selectedType[t.id] === "private" && t.privatePricePerPerson ? (
                        <>
                          <div className="font-display text-xl font-bold" style={{color:"#B88A44"}}>
                            <PriceDisplay mad={priceWithCommission(t.privatePricePerPerson)} size="md" />
                          </div>
                          <div className="text-[10px] text-charcoal-400 mt-0.5">/ pers. · Privatisé 2-5 pers.</div>
                        </>
                      ) : t.minPrice ? (
                        <>
                          <div className="font-display text-xl font-bold" style={{color:"#B88A44"}}>
                            <PriceDisplay mad={priceWithCommission(t.minPrice)} size="md" />
                          </div>
                          <div className="text-[10px] text-charcoal-400 mt-0.5">/ pers. · Groupe</div>
                        </>
                      ) : (
                        <div className="text-xs text-charcoal-400">Prix sur demande</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-bold px-4 py-2.5 rounded-full text-xs no-underline active:scale-95 transition-transform"
                      style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
                      Réserver <ArrowRight size={11} weight="bold" />
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
                                <div key={i} className="flex gap-3 mb-3 last:mb-0 relative"
                                  style={{opacity: openId === t.id ? 1 : 0, transform: openId === t.id ? "translateX(0)" : "translateX(-12px)", transition:`opacity 0.4s ease-out ${i*120}ms, transform 0.4s ease-out ${i*120}ms`}}>
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold z-10"
                                    style={{background:"linear-gradient(135deg,#7D8F69,#566547)", minWidth:24, transition:`transform 0.3s ease-out ${i*120+100}ms`}}>
                                    {i+1}
                                  </div>
                                  <div className="flex-1 bg-white rounded-xl px-3 py-2" style={{border:"1px solid rgba(234,220,200,0.6)", boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                                    {step.time && <div className="text-[9px] font-bold mb-0.5" style={{color:"#B88A44"}}>{step.time}</div>}
                                    <div className="text-xs font-semibold text-charcoal-800">{step.title}</div>
                                    {step.desc && <div className="text-[10px] text-charcoal-400 mt-0.5 leading-relaxed">{step.desc}</div>}
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
      {/* MODAL INFO GROUPE/PRIVE */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)"}}
          onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-sand-300 rounded-full mx-auto mb-5" />
            <h3 className="font-display text-lg font-bold text-charcoal-800 mb-4">Groupe ou Privé ?</h3>
            <div className="flex flex-col gap-3 mb-5">
              <div className="bg-sand-100 rounded-2xl p-4" style={{border:"1px solid #EADCC8"}}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-bronze-500 flex items-center justify-center flex-shrink-0">
                    <Users size={14} weight="bold" className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-charcoal-800">👥 Expérience en Groupe</span>
                </div>
                {[
                  "🕐 Créneaux de départ fixes — vous choisissez parmi les horaires disponibles",
                  "🚐 Ramassage gratuit si votre hôtel est dans un rayon de 10km du centre de Marrakech",
                  "💰 Frais supplémentaires de 110 MAD/pers. si vous résidez en dehors de Marrakech",
                  "👫 Vous partagez l experience avec d autres voyageurs",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-xs leading-relaxed text-charcoal-600">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-charcoal-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#B88A44"}}>
                    <Lock size={14} weight="bold" className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">🔒 Expérience Privée</span>
                </div>
                {[
                  "🕐 Vous choisissez librement votre heure de départ",
                  "🚐 Ramassage inclus depuis votre lieu de résidence — partout à Marrakech",
                  "👑 Le prestataire est 100% dédié à votre groupe (2-5 pers.)",
                  "✨ Programme personnalisable selon vos envies",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-xs leading-relaxed text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowInfo(false)}
              className="w-full py-3.5 text-white font-bold rounded-full text-sm"
              style={{background:"linear-gradient(135deg, #B88A44, #9A7238)"}}>
              Compris !
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
