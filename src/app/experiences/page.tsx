"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlass, SlidersHorizontal, Star, ArrowRight, SealCheck,
  CaretDown, CaretUp, Heart, Users, Lock, CaretLeft, CaretRight, Clock
} from "@phosphor-icons/react";
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
  const [animatedId, setAnimatedId] = useState<string|null>(null);
  const [city, setCity] = useState<string|null>(null);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular"|"recent"|"price_asc"|"price_desc">("popular");
  const [showSort, setShowSort] = useState(false);
  const [selectedType, setSelectedType] = useState<Record<string,"group"|"private">>({});
  const [photoIdx, setPhotoIdx] = useState<Record<string,number>>({});
  const [showInfo, setShowInfo] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const { convert } = useExchangeRate();

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

  const heroPhotos = tours.flatMap(t => t.photos || []).filter(Boolean).slice(0, 6);
  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const interval = setInterval(() => setHeroIdx(i => (i + 1) % heroPhotos.length), 4000);
    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  const CITIES = [
    {name:"Toutes", emoji:"✦"},
    {name:"Marrakech", emoji:"🌹"},
    {name:"Fes", emoji:"🕌"},
    {name:"Essaouira", emoji:"🌊"},
    {name:"Chefchaouen", emoji:"💙"},
    {name:"Agadir", emoji:"🏖️"},
  ];

  return (
    <div className="min-h-screen pb-24" style={{background:"#F6F1E8"}}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{background:"rgba(246,241,232,0.88)", backdropFilter:"blur(20px) saturate(160%)", borderBottom:"1px solid rgba(184,138,68,0.12)"}}>
        <Link href="/" className="no-underline flex items-center gap-2">
          <img src="/logo7.png" alt="Laksor" style={{height:30, width:"auto", objectFit:"contain", maxWidth:110}} />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/search" className="no-underline w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{background:"rgba(255,255,255,0.6)", border:"1.5px solid rgba(184,138,68,0.22)"}}>
            <MagnifyingGlass size={16} className="text-charcoal-800" />
          </Link>
          <div className="h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold"
            style={{background:"rgba(255,255,255,0.6)", border:"1.5px solid rgba(184,138,68,0.22)"}}>
            <span>🇲🇦</span><span className="text-charcoal-800">FR</span>
          </div>
        </div>
      </nav>

      {/* CATEGORIES SCROLL */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 flex-shrink-0" style={{scrollbarWidth:"none", borderBottom:"1px solid rgba(184,138,68,0.08)"}}>
        {[
          {id:"all", label:"Tout", emoji:"✨"},
          {id:"desert", label:"Désert", emoji:"🐪"},
          {id:"gastronomie", label:"Gastro", emoji:"🍽️"},
          {id:"art", label:"Art & Craft", emoji:"🎨"},
          {id:"medina", label:"Médina", emoji:"🕌"},
          {id:"nature", label:"Nature", emoji:"🌄"},
          {id:"photo", label:"Photo", emoji:"📸"},
          {id:"sport", label:"Aventure", emoji:"🧗"},
        ].map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={"flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold transition-all " + (category === cat.id ? "text-white" : "text-charcoal-600")}
            style={category === cat.id
              ? {background:"linear-gradient(135deg,#B88A44,#9A7238)", boxShadow:"0 3px 10px rgba(184,138,68,0.3)"}
              : {background:"white", border:"1.5px solid #EADCC8"}}>
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden" style={{height:220}}>
        {heroPhotos.length > 0 ? (
          <>
            {heroPhotos.map((photo, i) => (
              <img key={i} src={photo} alt="Expérience Laksor"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{opacity: i === heroIdx ? 1 : 0}} />
            ))}
            {heroPhotos.length > 1 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-10">
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
        <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(8,4,1,0.85) 0%, rgba(8,4,1,0.35) 50%, rgba(8,4,1,0.05) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{color:"rgba(184,138,68,0.9)"}}>Maroc Authentique</div>
          <h1 className="font-display text-3xl font-bold text-white mb-2" style={{lineHeight:1.08}}>
            Vivez le Maroc<br/><em className="not-italic" style={{color:"#EADCC8"}}>de l'intérieur</em>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm" style={{color:"rgba(255,255,255,0.85)"}}>
              <div className="w-2 h-2 rounded-full" style={{background:"#4ade80", boxShadow:"0 0 6px #4ade80"}} />
              {tours.length} expériences
            </div>
            <div className="text-sm" style={{color:"rgba(255,255,255,0.85)"}}>🇲🇦 5 villes</div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTRES */}
      <div className="px-4 pt-4 pb-0" style={{background:"#F6F1E8"}}>
        <div className="flex items-center gap-3 bg-white rounded-full px-4 h-12 mb-3"
          style={{border:"1.5px solid #EADCC8", boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <MagnifyingGlass size={15} className="text-bronze-500 flex-shrink-0" />
          <span className="text-sm flex-1" style={{color:"rgba(17,17,17,0.4)"}}>Que voulez-vous découvrir ?</span>
          <div className="relative">
            <button onClick={() => setShowSort(!showSort)}
              className={"flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all " + (sortBy !== "popular" ? "text-white" : "text-charcoal-600")}
              style={{background: sortBy !== "popular" ? "#B88A44" : "#EDE6D6"}}>
              <SlidersHorizontal size={11} weight="bold" /> Trier
            </button>
            {showSort && (
              <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg z-20 overflow-hidden" style={{width:180, border:"1px solid #EADCC8"}}>
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

        {/* CITY CHIPS */}
        <div className="flex gap-2 overflow-x-auto pb-3" style={{scrollbarWidth:"none"}}>
          {CITIES.map(c => (
            <button key={c.name} onClick={() => setCity(c.name === "Toutes" ? null : (city === c.name ? null : c.name))}
              className={"flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-all " + ((c.name === "Toutes" && !city) || city === c.name ? "text-white" : "text-charcoal-800")}
              style={{
                background: (c.name === "Toutes" && !city) || city === c.name ? "#111111" : "white",
                border: (c.name === "Toutes" && !city) || city === c.name ? "1.5px solid #111" : "1.5px solid #EADCC8"
              }}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS HEADER */}
      <div className="flex items-baseline justify-between px-4 pb-3 pt-1">
        <div>
          <h2 className="font-display text-xl font-bold text-charcoal-800">
            {city ? "Expériences à " + city : "Toutes les expériences"}
          </h2>
          <div className="text-[11px] text-charcoal-400 mt-0.5">Guides certifiés Ministère du Tourisme</div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:"rgba(184,138,68,0.1)", color:"#B88A44"}}>{tours.length}</span>
      </div>

      {/* CARDS */}
      <div className="px-4 flex flex-col gap-0 max-w-lg mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-bronze-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center" style={{border:"1px solid #EADCC8"}}>
            <div className="text-sm font-bold text-charcoal-800">Aucune expérience disponible</div>
          </div>
        ) : (
          <>
            {/* PREMIERE CARTE — grande */}
            {tours.slice(0, 1).map(t => (
              <Link key={t.id}
                href={t.isGuideExperience ? "/booking/" + t.guideId + "?expId=" + t.expId + "&bookingType=" + (selectedType[t.id]||"group") + "&tourPrice=" + Math.ceil((selectedType[t.id]==="private" && t.privatePricePerPerson ? t.privatePricePerPerson : t.minPrice) * 1.25) : "/experiences/" + (t.tourType||"").toLowerCase()}
                className="no-underline block mb-4 rounded-[22px] overflow-hidden bg-white active:scale-[0.99] transition-all"
                style={{boxShadow:"0 6px 28px rgba(0,0,0,0.09)"}}>
                {/* IMAGE GRANDE */}
                <div className="relative overflow-hidden" style={{height:200}}>
                  {t.photos?.length > 0 ? (
                    <>
                      <div className="flex h-full transition-transform duration-500 ease-out"
                        style={{transform:`translateX(-${(photoIdx[t.id]||0)*100}%)`}}>
                        {t.photos.map((photo:string, pi:number) => (
                          <img key={pi} src={photo} alt={t.title} className="w-full h-full object-cover flex-shrink-0" style={{minWidth:"100%"}} />
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
                        </>
                      )}
                    </>
                  ) : (
                    <img src={t.coverImage || "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"} alt={t.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(10,6,2,0.65), transparent)"}} />
                  {/* Badge guides */}
                  {t.guideCount > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{background:"rgba(255,255,255,0.93)", backdropFilter:"blur(8px)", boxShadow:"0 2px 8px rgba(0,0,0,0.12)"}}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{background:"#4ade80", boxShadow:"0 0 5px #4ade80"}} />
                      {t.guideCount} guide{t.guideCount > 1 ? "s" : ""} dispo
                    </div>
                  )}
                  {t.isGuideExperience && t.guideId === "cmq5fr4ef0002xbtvwrfquu46" && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white text-[10px] font-bold" style={{background:"#B88A44"}}>
                      <SealCheck size={11} weight="fill" /> Laksor
                    </div>
                  )}
                  <button onClick={e => e.preventDefault()} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)"}}>
                    <Heart size={14} className="text-charcoal-400" />
                  </button>
                  {/* Ruban type */}
                  <div className="absolute bottom-3 left-0 flex items-center gap-1.5 py-1.5 pl-4 pr-5 rounded-r-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{background:"#B88A44", boxShadow:"2px 2px 10px rgba(184,138,68,0.5)"}}>
                    {t.isGuideExperience ? "✦ Expérience" : (EMOJI[t.tourType] || "") + " Tour"}
                  </div>
                </div>
                {/* BODY */}
                <div className="px-4 pt-3.5 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg font-bold text-charcoal-800 flex-1" style={{lineHeight:1.2}}>{t.title}</h3>
                    {t.guide?.avgRating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                        <Star size={12} weight="fill" className="text-bronze-500" />
                        <span className="text-sm font-bold text-charcoal-800">{Number(t.guide.avgRating).toFixed(1)}</span>
                        <span className="text-[11px] text-charcoal-400">({t.guide.totalReviews})</span>
                      </div>
                    )}
                  </div>
                  {t.description && (
                    <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{color:"rgba(17,17,17,0.55)"}}>{t.description}</p>
                  )}
                  {/* META CHIPS */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {t.duration && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:"#F6F1E8", border:"1px solid #EADCC8"}}>
                        <Clock size={12} className="text-bronze-500" weight="fill" /> {t.duration}
                      </div>
                    )}
                    {t.groupSize && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:"#F6F1E8", border:"1px solid #EADCC8"}}>
                        <Users size={12} className="text-bronze-500" weight="fill" /> {t.groupSize}
                      </div>
                    )}
                    {t.guide && t.guideId !== "cmq5fr4ef0002xbtvwrfquu46" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{background:"rgba(125,143,105,0.1)", border:"1px solid rgba(125,143,105,0.25)", color:"#7D8F69"}}>
                        <SealCheck size={12} weight="fill" /> Guide certifié
                      </div>
                    )}
                  </div>
                  {/* TOGGLE GROUPE/PRIVE */}
                  {t.privatePricePerPerson && (
                    <div className="flex p-1 rounded-full mb-3" style={{background:"#F6F1E8"}}>
                      <button onClick={e => { e.preventDefault(); setSelectedType(prev => ({...prev, [t.id]: "group"})); }}
                        className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all " + ((selectedType[t.id]||"group") === "group" ? "text-white" : "text-charcoal-500")}
                        style={(selectedType[t.id]||"group") === "group" ? {background:"#B88A44", boxShadow:"0 2px 8px rgba(184,138,68,0.3)"} : {}}>
                        <Users size={11} weight="bold" /> Groupe
                      </button>
                      <button onClick={e => { e.preventDefault(); setSelectedType(prev => ({...prev, [t.id]: "private"})); }}
                        className={"flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all " + (selectedType[t.id] === "private" ? "text-white" : "text-charcoal-500")}
                        style={selectedType[t.id] === "private" ? {background:"#111", boxShadow:"0 2px 8px rgba(0,0,0,0.2)"} : {}}>
                        <Lock size={11} weight="bold" /> Privé
                      </button>
                    </div>
                  )}
                  {/* FOOTER */}
                  <div className="flex items-center justify-between pt-3" style={{borderTop:"1px solid #EADCC8"}}>
                    <div>
                      <div className="text-[10px] text-charcoal-400 uppercase tracking-wide mb-0.5">À partir de</div>
                      <div className="font-display text-2xl font-bold text-charcoal-800 leading-none">
                        {selectedType[t.id] === "private" && t.privatePricePerPerson
                          ? <PriceDisplay mad={priceWithCommission(t.privatePricePerPerson)} size="lg" />
                          : t.minPrice ? <PriceDisplay mad={priceWithCommission(t.minPrice)} size="lg" /> : "—"}
                      </div>
                      <div className="text-[11px] text-charcoal-400 mt-0.5">
                        {selectedType[t.id] === "private" ? "/ pers. · Privatisé" : "/ pers. · Groupe"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-semibold px-5 py-2.5 rounded-full text-sm"
                      style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 3px 12px rgba(184,138,68,0.35)"}}>
                      Réserver <ArrowRight size={13} weight="bold" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* SECTION LABEL */}
            {tours.length > 1 && (
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{color:"#B88A44"}}>Également disponibles</span>
                <div className="flex-1 h-px" style={{background:"linear-gradient(to right, rgba(184,138,68,0.4), transparent)"}} />
              </div>
            )}

            {/* GRILLE 2 COLONNES */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {tours.slice(1).map(t => (
                <Link key={t.id}
                  href={t.isGuideExperience ? "/booking/" + t.guideId + "?expId=" + t.expId + "&bookingType=" + (selectedType[t.id]||"group") + "&tourPrice=" + Math.ceil((selectedType[t.id]==="private" && t.privatePricePerPerson ? t.privatePricePerPerson : t.minPrice) * 1.25) : "/experiences/" + (t.tourType||"").toLowerCase()}
                  className="no-underline block rounded-[18px] overflow-hidden bg-white active:scale-[0.98] transition-all"
                  style={{boxShadow:"0 4px 18px rgba(0,0,0,0.08)"}}>
                  {/* IMAGE */}
                  <div className="relative overflow-hidden" style={{height:130}}>
                    {t.photos?.[0] || t.coverImage
                      ? <img src={t.photos?.[0] || t.coverImage} alt={t.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl" style={{background:"rgba(125,143,105,0.1)"}}>{EMOJI[t.tourType] || "🧭"}</div>
                    }
                    <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(10,6,2,0.6), transparent)"}} />
                    {/* Ruban type */}
                    <div className="absolute top-2.5 left-0 py-1 pl-3 pr-3.5 rounded-r-full text-[9px] font-bold uppercase tracking-wider text-white"
                      style={{background:"#B88A44"}}>
                      {t.isGuideExperience ? "✦" : (EMOJI[t.tourType] || "")} {t.isGuideExperience ? "Exp." : "Tour"}
                    </div>
                    <button onClick={e => e.preventDefault()}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{background:"rgba(255,255,255,0.85)", backdropFilter:"blur(6px)"}}>
                      <Heart size={12} className="text-charcoal-400" />
                    </button>
                    {/* Guides dispo */}
                    {t.guideCount > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold text-white">
                        <div className="w-1.5 h-1.5 rounded-full" style={{background:"#4ade80"}} />
                        {t.guideCount} guide{t.guideCount > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  {/* BODY */}
                  <div className="px-3 py-3">
                    <div className="font-display text-sm font-bold text-charcoal-800 mb-1.5 line-clamp-2" style={{lineHeight:1.2}}>{t.title}</div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      {t.duration && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium" style={{background:"#F6F1E8"}}>
                          <Clock size={10} className="text-bronze-500" weight="fill" /> {t.duration}
                        </div>
                      )}
                      {t.groupSize && (
                        <div className="flex items-center gap-1 text-[10.5px] font-medium text-charcoal-500">{t.groupSize}</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-base font-bold text-charcoal-800 leading-none">
                          {t.minPrice ? <PriceDisplay mad={priceWithCommission(t.minPrice)} size="sm" /> : "—"}
                        </div>
                        <div className="text-[10px] text-charcoal-400">/ pers.</div>
                      </div>
                      {t.guide?.avgRating > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star size={11} weight="fill" className="text-bronze-500" />
                          <span className="text-xs font-bold text-charcoal-800">{Number(t.guide.avgRating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* MODAL QUELLE DIFFERENCE */}
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
                      {["🕐 Créneaux de départ fixes","🚐 Ramassage gratuit dans 10km du centre","💰 +110 MAD/pers. hors Marrakech","👫 Partagez avec d'autres voyageurs"].map((item, i) => (
                        <div key={i} className="text-xs text-charcoal-600 mb-1.5 last:mb-0">{item}</div>
                      ))}
                    </div>
                    <div className="bg-charcoal-800 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#B88A44"}}>
                          <Lock size={14} weight="bold" className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">🔒 Expérience Privée</span>
                      </div>
                      {["🕐 Heure de départ libre","🚐 Ramassage inclus partout","👑 Prestataire 100% dédié (2-5 pers.)","✨ Programme personnalisable"].map((item, i) => (
                        <div key={i} className="text-xs text-white/70 mb-1.5 last:mb-0">{item}</div>
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
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
