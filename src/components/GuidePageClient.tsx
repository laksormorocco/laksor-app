"use client";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, ShareNetwork, MapPin, Star,
  Clock, Shield, Translate, Camera, CheckCircle,
  ThumbsUp, Eye, CalendarCheck, Lightning, Certificate
} from "@phosphor-icons/react";

function toEur(mad: number): string {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

import { LANG_FLAGS, flagEmoji } from "@/lib/langFlags";

  const map: Record<string,string> = {
    FR:"🇫🇷", GB:"🇬🇧", ES:"🇪🇸", DE:"🇩🇪",
    IT:"🇮🇹", MA:"🇲🇦", RU:"🇷🇺", IL:"🇮🇱",
    PT:"🇵🇹", CN:"🇨🇳"
}
const TABS = ["apropos", "tours", "avis", "photos"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = {
  apropos: "À propos",
  tours:   "Tours",
  avis:    "Avis",
  photos:  "Photos",
};

export default function GuidePageClient({ guide }: { guide: any }) {
  const [tab,        setTab]       = useState<Tab>("apropos");
  const [liked,      setLiked]     = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const tabsRef  = useRef<HTMLDivElement>(null);
  const touchX   = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll pour sticky tabs
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Swipe gauche/droite
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) < 60) return;
    const idx = TABS.indexOf(tab);
    if (dx < 0 && idx < TABS.length - 1) setTab(TABS[idx + 1]);
    if (dx > 0 && idx > 0)              setTab(TABS[idx - 1]);
  }, [tab]);

  // Views
  useEffect(() => {
    fetch("/api/guide/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId: guide.id })
    }).catch(() => {});
  }, [guide.id]);

  const TabBar = ({ sticky = false }: { sticky?: boolean }) => (
    <div className={`flex bg-white border-b border-sand-300 overflow-x-auto ${sticky ? "" : ""}`}
      style={{ scrollbarWidth: "none" }}>
      {TABS.map(t => (
        <button key={t} onClick={() => setTab(t)}
          className={`px-5 py-3.5 text-xs font-bold flex-shrink-0 border-b-2 transition-colors
            ${tab === t ? "text-bronze-500 border-bronze-500" : "text-charcoal-400 border-transparent"}`}>
          {TAB_LABELS[t]}{t === "avis" ? ` (${guide.totalReviews})` : ""}
          {t === "tours" ? ` (${guide.tours?.filter((gt: any) => gt.isActive).length ?? 0})` : ""}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-sand-200 min-h-screen pb-36">

      {/* ── STICKY TABS (appear on scroll) ── */}
      {showSticky && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
          <TabBar sticky />
        </div>
      )}

      {/* ── COVER ── */}
      <div className="relative h-72">
        <img
          src={guide.avatar ?? "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"}
          alt={guide.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link href="/search"
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <ArrowLeft size={16} color="#fff" weight="bold" />
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Heart size={16} color={liked ? "#FF385C" : "#fff"} weight={liked ? "fill" : "regular"} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <ShareNetwork size={16} color="#fff" weight="bold" />
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={12} color="rgba(255,255,255,0.65)" weight="fill" />
            <span className="text-white/65 text-xs">{guide.city}</span>
          </div>
          <div className="font-display text-2xl font-semibold text-white mb-2 leading-tight">
            {guide.displayName}
          </div>
          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {guide.avgRating > 0 && (
              <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-2.5 py-1 text-white text-xs font-bold">
                ⭐ {Number(guide.avgRating).toFixed(1)} ({guide.totalReviews})
              </span>
            )}
            {guide.yearsExp > 0 && (
              <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-2.5 py-1 text-white text-xs font-medium">
                <Clock size={10} /> {guide.yearsExp} ans d'exp.
              </span>
            )}
            <span className="flex items-center gap-1 bg-sage-300/85 rounded-full px-2.5 py-1 text-white text-xs font-bold">
              ✓ Certifié
            </span>
          </div>
        </div>
      </div>

      {/* ── BOOKING HERO ── */}
      <div className="bg-white border-b border-sand-300 px-4 py-4">
        {/* Social proof */}
        <div className="flex gap-3 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-1.5 bg-sand-200 rounded-full px-3 py-1.5 flex-shrink-0">
            <Eye size={12} className="text-charcoal-400" />
            <span className="text-xs font-semibold text-charcoal-500">142 vues cette semaine</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sage-50 border border-sage-300 rounded-full px-3 py-1.5 flex-shrink-0">
            <CalendarCheck size={12} className="text-sage-300" weight="fill" />
            <span className="text-xs font-bold text-sage-300">Disponible cette semaine</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sand-200 rounded-full px-3 py-1.5 flex-shrink-0">
            <Lightning size={12} className="text-bronze-500" weight="fill" />
            <span className="text-xs font-semibold text-charcoal-500">🔥 3 rés. cette semaine</span>
          </div>
        </div>

        {/* Prix + CTA */}
        {guide.tours?.filter((t:any)=>t.isActive).length === 0 && <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-charcoal-400 font-medium">À partir de</div>
            <div className="font-display text-2xl font-bold text-charcoal-800 leading-tight">
              {guide.halfDayPrice} MAD
            </div>
            <div className="text-xs text-charcoal-400">/ 2 personnes</div>
          </div>
<div className="text-right">
              <div className="text-xs text-charcoal-400 mt-0.5">Prochain dispo : Samedi</div>
            </div>
        </div>}

        {/* Bouton vert */}
        {/* Trust mini */}
        <div className="flex items-center justify-center gap-4 mt-3">
          {[
            { icon: "🔄", text: "Annulation 72h" },
            { icon: "💵", text: "Cash le jour J" },
            { icon: "🛡️", text: "Guide vérifié" },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-1 text-[10px] text-charcoal-400 font-medium">
              <span>{t.icon}</span>{t.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── BADGES ── */}
      <div className="bg-white border-b border-sand-300 flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-2 bg-sage-50 border border-sage-300 rounded-xl px-3 py-2 flex-shrink-0">
          <span>⏰</span>
          <div><div className="text-[10px] font-bold text-sage-300">100% PONCTUEL</div><div className="text-[9px] text-charcoal-400">{guide.totalReviews} visites</div></div>
        </div>
        {Number(guide.avgRating) >= 4.8 && (
          <div className="flex items-center gap-2 bg-bronze-50 border border-bronze-500 rounded-xl px-3 py-2 flex-shrink-0">
            <span>🏆</span>
            <div><div className="text-[10px] font-bold text-bronze-500">SUPER GUIDE</div><div className="text-[9px] text-charcoal-400">Top 5%</div></div>
          </div>
        )}
        <div className="flex items-center gap-2 bg-sand-200 border border-sand-300 rounded-xl px-3 py-2 flex-shrink-0">
          <span>⚡</span>
          <div className="text-[10px] font-bold text-charcoal-600">RÉPONSE &lt;1H</div>
        </div>
        <div className="flex items-center gap-2 bg-sand-200 border border-sand-300 rounded-xl px-3 py-2 flex-shrink-0">
          <Certificate size={16} className="text-bronze-500" weight="duotone" />
          <div className="text-[10px] font-bold text-charcoal-600">CERTIFIÉ MINISTÈRE</div>
        </div>
      </div>

      {/* ── TABS (anchor) ── */}
      <div ref={tabsRef}>
        <TabBar />
      </div>

      {/* ── TAB CONTENT ── */}
      <div ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="px-4 pt-4">

        {/* ══ À PROPOS ══ */}
        {tab === "apropos" && (
          <div className="flex flex-col gap-3">

            {/* Bio */}
            <div className="bg-white rounded-2xl overflow-hidden border border-sand-300">
              <div className="border-l-4 border-bronze-500 bg-sand-100 p-4">
                <div className="font-display text-3xl text-bronze-500 leading-none mb-1">"</div>
                <p className="text-sm text-charcoal-500 leading-relaxed italic">
                  {guide.bio || "Guide passionné, je vous invite à découvrir les secrets de cette ville magnifique."}
                </p>
              </div>
            </div>

            {/* Infos condensées */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-sand-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-charcoal-400 uppercase tracking-wide mb-1">
                    <MapPin size={10} className="text-bronze-500" weight="fill" /> Ville
                  </div>
                  <div className="text-sm font-semibold text-charcoal-800">{guide.city}</div>
                </div>
                <div className="bg-sand-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-charcoal-400 uppercase tracking-wide mb-1">
                    <CheckCircle size={10} className="text-sage-300" weight="fill" /> Transport
                  </div>
                  <div className="text-sm font-semibold text-sage-300">Disponible</div>
                </div>
              </div>

              {/* Langues */}
              {guide.languages?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Translate size={14} className="text-bronze-500" weight="duotone" />
                    <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Langues</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map((l: string) => (
                      <span key={l} className="flex items-center gap-1.5 bg-bronze-50 border border-bronze-500 text-bronze-500 text-xs font-bold px-3 py-1.5 rounded-full">
                        {flagEmoji(LANG_FLAGS[l] || "")} {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spécialités */}
              {guide.specialties?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-bronze-500" weight="duotone" />
                    <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Spécialités</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guide.specialties.map((s: string) => (
                      <span key={s} className="bg-sand-200 border border-sand-300 text-charcoal-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pourquoi choisir ce guide */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="text-sm font-bold text-charcoal-800 mb-3">
                Pourquoi les voyageurs choisissent {guide.displayName.split(" ")[0]}
              </div>
              <div className="flex flex-col gap-0">
                {[
                  guide.city && `Originaire de ${guide.city}`,
                  guide.yearsExp > 0 && `${guide.yearsExp} ans d'expérience terrain`,
                  "Réponse en moins d'1h sur WhatsApp",
                  guide.totalReviews > 0 && `${guide.totalReviews} expériences · ${Number(guide.avgRating).toFixed(1)}/5`,
                  guide.languages?.length > 0 && guide.languages.join(", "),
                  "Transport privé disponible",
                  "Accès à des lieux exclusifs",
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-sand-200 last:border-0">
                    <div className="w-6 h-6 rounded-full bg-sage-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-sage-300" weight="fill" />
                    </div>
                    <span className="text-sm text-charcoal-700 font-medium">{item as string}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 premiers avis */}
            {guide.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl border border-sand-300 overflow-hidden">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal-800">Avis récents</span>
                  <button onClick={() => setTab("avis")} className="text-xs font-bold text-bronze-500">Voir tout →</button>
                </div>
                {guide.reviews.slice(0, 2).map((r: any) => (
                  <div key={r.id} className="px-4 py-3 border-t border-sand-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-sand-300 flex items-center justify-center font-bold text-charcoal-600 text-sm flex-shrink-0">
                        {r.author?.name?.[0] ?? "V"}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-charcoal-800">{r.author?.name ?? "Voyageur"}</div>
                      </div>
                      <div className="text-bronze-500 text-xs">{"★".repeat(r.rating)}</div>
                    </div>
                    <p className="text-xs text-charcoal-400 leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TOURS ══ */}
        {tab === "tours" && (
          <div className="flex flex-col gap-3">
            {guide.tours?.filter((gt: any) => gt.isActive).length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
                <span className="text-4xl block mb-3">🧭</span>
                <div className="text-sm font-bold text-charcoal-800 mb-1">Aucun tour disponible</div>
                <div className="text-xs text-charcoal-400">Ce guide n'a pas encore activé de tours</div>
              </div>
            ) : (
              guide.tours?.filter((gt: any) => gt.isActive).map((gt: any) => (
                <TourCard key={gt.id} guideTour={gt} guideId={guide.id} />
              ))
            )}
          </div>
        )}

        {/* ══ AVIS ══ */}
        {tab === "avis" && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-sand-300 p-4">
              <div className="flex gap-4 items-center mb-4 pb-4 border-b border-sand-200">
                <div className="text-center">
                  <div className="font-display text-5xl font-bold text-bronze-500 leading-none">
                    {Number(guide.avgRating).toFixed(1)}
                  </div>
                  <div className="text-bronze-500 text-lg mt-1">★★★★★</div>
                  <div className="text-xs text-charcoal-400 mt-1">{guide.totalReviews} avis</div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {[
                    { label: "⏰ Ponctualité",   val: "5.0", w: "100%" },
                    { label: "🗣️ Communication", val: "4.9", w: "98%"  },
                    { label: "🏛️ Connaissance",  val: "5.0", w: "100%" },
                    { label: "💰 Qualité/prix",  val: "4.8", w: "96%"  },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-charcoal-400">{r.label}</span>
                        <span className="font-bold text-sage-300">{r.val}</span>
                      </div>
                      <div className="h-1.5 bg-sand-300 rounded-full overflow-hidden">
                        <div className="h-full bg-sage-300 rounded-full" style={{ width: r.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sage-300">
                <ThumbsUp size={13} weight="fill" />
                <span className="text-xs font-bold">97% recommandent {guide.displayName.split(" ")[0]}</span>
              </div>
            </div>

            {guide.reviews?.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl border border-sand-300 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-sand-300 flex items-center justify-center font-bold text-charcoal-600 flex-shrink-0">
                    {r.author?.name?.[0] ?? "V"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-charcoal-800">{r.author?.name ?? "Voyageur"}</div>
                    <div className="text-[10px] text-charcoal-400">{new Date(r.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</div>
                  </div>
                  <div className="text-bronze-500 text-sm">{"★".repeat(r.rating)}</div>
                </div>
                <p className="text-sm text-charcoal-500 leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}

        {/* ══ PHOTOS ══ */}
        {tab === "photos" && (
          <div>
            {guide.gallery?.length === 0 && !guide.avatar ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
                <Camera size={32} className="text-charcoal-300 mx-auto mb-3" weight="duotone" />
                <div className="text-sm text-charcoal-400">Aucune photo disponible</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {guide.avatar && (
                  <div className="col-span-2">
                    <img src={guide.avatar} alt="" className="w-full h-48 object-cover rounded-2xl" />
                  </div>
                )}
                {guide.gallery?.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded-xl" />
                ))}
                {guide.gallery?.length > 0 && (
                  <div className="aspect-square bg-sand-300 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-charcoal-500">+{guide.gallery.length} photos</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER STICKY ── */}
      {tab !== "tours" && <div className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-lg border-t border-sand-300 px-4 pt-3 pb-6 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-charcoal-400">À partir de</div>
            <div className="font-display text-xl font-bold text-charcoal-800 leading-tight">
              {guide.halfDayPrice} <span className="text-sm font-normal text-charcoal-400">MAD / 2 pers.</span>
            </div>
            {guide.avgRating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} weight="fill" className="text-bronze-500" />
                <span className="text-xs font-bold text-charcoal-800">{Number(guide.avgRating).toFixed(1)}</span>
                <span className="text-xs text-charcoal-400">({guide.totalReviews} avis)</span>
              </div>
            )}
          </div>
          <a href={"/booking/" + guide.id} className="w-full bg-sage-300 hover:bg-sage-400 text-white font-bold py-4 rounded-full text-sm transition-colors flex items-center justify-center gap-2 no-underline">Verifier les disponibilites</a>
        </div>
      </div>}
    </div>
  );
}

// ── TOUR CARD ──
function TourCard({ guideTour, guideId }: { guideTour: any; guideId: string }) {
  const [open, setOpen] = useState(false);
  const t = guideTour.template;
  if (!t) return null;

  const included: string[] = Array.isArray(t.included) ? t.included : [];
  const notIncluded: string[] = Array.isArray(t.notIncluded) ? t.notIncluded : [];
  const tags: string[] = Array.isArray(t.tags) ? t.tags : [];
  const itinerary: any[] = Array.isArray(t.itinerary) ? t.itinerary : [];
  const emoji = t.tourType === "MEDINA_SECRETS" ? "🕌" : t.tourType === "GASTRONOMIE" ? "🍽️" : t.tourType === "HISTOIRE_MONUMENTS" ? "🏛️" : t.tourType === "DESERT_NATURE" ? "🏜️" : t.tourType === "SHOPPING_ARTISANAT" ? "🛍️" : t.tourType === "COUCHER_SOLEIL" ? "🌅" : "📸";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-sm">

      {/* IMAGE */}
      <div className="relative h-56">
        {t.coverImage
          ? <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-sage-300/30 to-sand-300 flex items-center justify-center text-6xl">{emoji}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* TOP - like + best seller */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {guideTour.isBestSeller
            ? <span className="bg-bronze-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">🔥 BEST SELLER</span>
            : <span />}
          <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
            <span className="text-sm">🤍</span>
          </button>
        </div>

        {/* BOTTOM - titre + stats inline */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="font-display text-xl text-white font-bold mb-2">{t.title}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/30">
              ⏱ {t.duration || "4h"}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/30">
              👥 {t.groupSize || "1-6 pers."}
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/30">
              🚶 {t.difficulty || "Facile"}
            </span>
            {guideTour.totalBookings > 0 && (
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/30">
                ✓ {guideTour.totalBookings} visite{guideTour.totalBookings > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">

        {/* DESCRIPTION */}
        {t.description && (
          <p className="text-xs text-charcoal-400 leading-relaxed mb-3 line-clamp-2">{t.description}</p>
        )}

        {/* PRIX */}
        <div className="flex items-center justify-between pt-3 border-t border-sand-200 mb-3">
          <div>
            <div className="text-[10px] text-charcoal-400 font-medium">A partir de</div>
            <div className="font-display text-xl font-bold text-charcoal-800">
              {guideTour.price} <span className="text-xs font-normal text-charcoal-400">MAD / 2 pers.</span>
            </div>
            <div className="text-[10px] text-bronze-500 font-semibold mt-0.5">+15% / pers. supplementaire</div>
          </div>
          <a href={"/booking/" + guideId + "?tourId=" + t.id}
            className="flex items-center gap-1.5 bg-sage-300 hover:bg-sage-400 text-white font-bold px-5 py-3 rounded-full text-sm no-underline transition-colors shadow-sm">
            Reserver <span className="text-base">→</span>
          </a>
        </div>

        {/* BOUTON DETAILS */}
        <button onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
            open
              ? "border-sage-300 text-sage-300 bg-sage-300/5"
              : "border-sage-300/40 text-sage-300 hover:border-sage-300 hover:bg-sage-300/5"
          }`}>
          {open ? "Masquer les details" : "Voir les details"}
          <span className={`transition-transform text-sm ${open ? "rotate-180" : ""}`}>↓</span>
        </button>
      </div>

      {/* ACCORDEON */}
      {open && (
        <div className="border-t-2 border-sage-300/20 p-4 bg-sand-100 flex flex-col gap-4">

          {itinerary.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-widest mb-3">Programme</div>
              {itinerary.map((step: any, i: number) => (
                <div key={i} className="flex gap-3 mb-3 last:mb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-sage-300 flex items-center justify-center text-white text-xs font-bold">{i+1}</div>
                    {i < itinerary.length-1 && <div className="w-0.5 flex-1 bg-sage-300/30 my-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    {step.time && <div className="text-[10px] font-bold text-bronze-500 mb-0.5">{step.time}</div>}
                    <div className="text-sm font-bold text-charcoal-800">{step.title}</div>
                    {step.desc && <div className="text-xs text-charcoal-400 mt-0.5 leading-relaxed">{step.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(included.length > 0 || notIncluded.length > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {included.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-sage-300/20">
                  <div className="text-[10px] font-bold text-sage-300 uppercase tracking-widest mb-2">Inclus</div>
                  {included.map((item:string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-sage-300 text-xs mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-xs text-charcoal-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {notIncluded.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Non inclus</div>
                  {notIncluded.map((item:string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-red-400 text-xs mt-0.5 flex-shrink-0 font-bold">✗</span>
                      <span className="text-xs text-charcoal-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}