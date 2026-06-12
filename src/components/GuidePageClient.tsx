"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, ShareNetwork, MapPin, Star,
  Clock, SealCheck, ShieldCheck, Eye, CalendarCheck, ArrowRight, Quotes
} from "@phosphor-icons/react";
import PriceDisplay from "@/components/PriceDisplay";
import { priceWithCommission } from "@/lib/pricing";

const TABS = ["tours", "apropos", "avis", "photos"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = {
  tours: "Tours", apropos: "A propos", avis: "Avis", photos: "Photos",
};

const LANG_MAP: Record<string, [number, number]> = {
  "Francais": [0x1F1EB, 0x1F1F7], "Français": [0x1F1EB, 0x1F1F7],
  "Anglais": [0x1F1EC, 0x1F1E7], "Espagnol": [0x1F1EA, 0x1F1F8],
  "Allemand": [0x1F1E9, 0x1F1EA], "Italien": [0x1F1EE, 0x1F1F9],
  "Arabe": [0x1F1F2, 0x1F1E6], "Russe": [0x1F1F7, 0x1F1FA],
  "Hebreu": [0x1F1EE, 0x1F1F1], "Portugais": [0x1F1F5, 0x1F1F9],
  "Chinois": [0x1F1E8, 0x1F1F3],
};

function getLangFlag(lang: string): string {
  const c = LANG_MAP[lang];
  if (!c) return lang;
  return String.fromCodePoint(c[0]) + String.fromCodePoint(c[1]);
}

export default function GuidePageClient({ guide }: { guide: any }) {
  const [tab, setTab] = useState<Tab>("tours");
  const [liked, setLiked] = useState(() => { try { return localStorage.getItem("liked_" + guide.id) === "1"; } catch { return false; } });
  const [showSticky, setShowSticky] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number>(0);

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

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStickyVisible(y < lastScrollY || y < 50);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) < 60) return;
    const idx = TABS.indexOf(tab);
    if (dx < 0 && idx < TABS.length - 1) setTab(TABS[idx + 1]);
    if (dx > 0 && idx > 0) setTab(TABS[idx - 1]);
  }, [tab]);

  useEffect(() => {
    fetch("/api/guide/views", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId: guide.id })
    }).catch(() => {});
  }, [guide.id]);

  const reviews = guide.reviews || [];
  const activeTours = guide.tours?.filter((t: any) => t.isActive) || [];
  const activeExperiences = guide.experiences || [];
  const [sortBy, setSortBy] = useState<"price_asc"|"price_desc"|"popular">("popular");

  const allItems = [
    ...activeTours.map((gt: any) => ({
      id: gt.id, type: "tour", title: gt.template?.title, price: gt.price,
      duration: gt.template?.duration, bookings: gt.totalBookings || 0, data: gt
    })),
    ...activeExperiences.map((exp: any) => ({
      id: exp.id, type: "experience", title: exp.title, price: exp.price,
      duration: exp.duration, bookings: 0, data: exp
    }))
  ].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return b.bookings - a.bookings;
  });

  const totalTours = allItems.length;
  const price = priceWithCommission(Number(guide.halfDayPrice) || 350);

  const TabBar = ({ sticky = false }: { sticky?: boolean }) => (
    <div className="flex bg-white border-b border-sand-200 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {TABS.map(t => (
        <button key={t} onClick={() => setTab(t)}
          className={"px-5 py-3.5 text-xs font-semibold flex-shrink-0 border-b-2 transition-colors " +
            (tab === t ? "text-bronze-500 border-bronze-500" : "text-charcoal-400 border-transparent")}>
          {TAB_LABELS[t]}
          {t === "avis" ? " (" + (guide.totalReviews || 0) + ")" : ""}
          {t === "tours" ? " (" + totalTours + ")" : ""}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-sand-200 min-h-screen pb-36" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* STICKY TABS */}
      {showSticky && (
        <div className={"fixed top-0 left-0 right-0 z-50 shadow-md transition-transform duration-300 " + (stickyVisible ? "translate-y-0" : "-translate-y-full")}>
          <div className="flex items-center h-12 px-4 bg-white border-b border-sand-200">
            <Link href="/search" className="w-8 h-8 rounded-full border border-sand-200 flex items-center justify-center mr-3 no-underline flex-shrink-0">
              <ArrowLeft size={14} weight="bold" className="text-charcoal-600" />
            </Link>
            <span className="font-display text-sm font-bold text-charcoal-800 truncate flex-1">{guide.displayName}</span>
          </div>
          <TabBar sticky />
        </div>
      )}

      {/* CTA STICKY BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-sand-200 px-4 py-3 flex items-center justify-between" style={{boxShadow:"0 -4px 20px rgba(17,17,17,0.08)"}}>
        <div>
          <div className="text-[10px] text-charcoal-400">A partir de</div>
          <PriceDisplay mad={price} size="md" />
          <div className="text-[10px] text-charcoal-400">/ groupe · 1-4 pers.</div>
        </div>
        <a href={activeTours.length > 0 ? "/booking/" + guide.id + "?tourId=" + activeTours[0]?.id + "&tourPrice=" + priceWithCommission(Number(activeTours[0]?.price || guide.halfDayPrice)) : "/booking/" + guide.id}
          className="flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-full text-sm no-underline"
          style={{background:"linear-gradient(135deg, #B88A44, #9A7238)", boxShadow:"0 4px 14px rgba(184,138,68,0.3)"}}>
          Réserver <ArrowRight size={14} weight="bold" />
        </a>
      </div>

      {/* HERO */}
      <div className="relative">
        <div className="relative overflow-hidden" style={{ height: 340 }}>
          <img
            src={guide.avatar ?? "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"}
            alt={guide.displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.1) 55%, transparent 100%)" }} />
        </div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link href="/search" className="w-10 h-10 rounded-full flex items-center justify-center no-underline" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
            <ArrowLeft size={18} weight="bold" className="text-white" />
          </Link>
          <div className="flex gap-2">
            <button onClick={() => { const n = !liked; setLiked(n); try { localStorage.setItem("liked_" + guide.id, n ? "1" : "0"); } catch {} }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
              <Heart size={18} weight={liked ? "fill" : "regular"} className={liked ? "text-red-400" : "text-white"} />
            </button>
            <button onClick={() => navigator.share && navigator.share({ title: guide.displayName, text: "Découvrez ce guide sur Laksor", url: window.location.href }).catch(()=>{})} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
              <ShareNetwork size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={13} className="text-white/70" weight="fill" />
            <span className="text-white/80 text-xs">{guide.city}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1 leading-tight">{guide.displayName}</h1>
          {guide.bio && <p className="text-white/70 text-xs leading-relaxed mb-2 line-clamp-2">{guide.bio}</p>}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(246,241,232,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Star size={11} weight="fill" className="text-amber-400" /> {guide.avgRating > 0 ? Number(guide.avgRating).toFixed(1) : "Nouveau"} {guide.totalReviews > 0 ? "(" + guide.totalReviews + ")" : ""}
              </span>
            {guide.yearsExp > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white" style={{ background: "rgba(246,241,232,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                {guide.yearsExp} ans d'exp.
              </span>
            )}
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "#7D8F69" }}>
              <SealCheck size={11} weight="bold" /> Certifie
            </span>
            {guide.docsStatus === "APPROVED" && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", color: "#fff", boxShadow: "0 2px 8px rgba(184,138,68,0.4)" }}>
                <ShieldCheck size={12} weight="fill" /> ID Verifie
              </span>
            )}
            {guide.languages?.slice(0,3).map((lang: string, i: number) => (
              <span key={i} className="px-2 py-1 rounded-full text-sm" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                {getLangFlag(lang)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS PILLS */}
      <div className="px-4 mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap flex-shrink-0 text-xs font-medium text-charcoal-800" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(17,17,17,0.08)", backdropFilter: "blur(8px)" }}>
          <Eye size={13} className="text-bronze-500" /> {guide.viewCount > 0 ? guide.viewCount + " vues" : "Nouveau"}
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap flex-shrink-0 text-xs font-medium text-sage-300" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(125,143,105,0.25)", backdropFilter: "blur(8px)" }}>
          <CalendarCheck size={13} /> Disponible cette semaine
        </div>
      </div>

      {/* PRICING CARD */}
      {activeTours.length === 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-3xl px-5 py-4" style={{ boxShadow: "0 2px 16px rgba(17,17,17,0.06)" }}>
            <p className="text-xs text-charcoal-400 mb-1">A partir de</p>
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <PriceDisplay mad={price} size="xl" />
              <span className="text-sm text-charcoal-400">/ jusqu a 4 pers.</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-sand-200">
              <span className="flex items-center gap-1 text-xs text-charcoal-400"><ArrowRight size={12} className="text-bronze-500" /> Annulation 72h</span>
              <span className="flex items-center gap-1 text-xs text-charcoal-400"><SealCheck size={12} className="text-sage-300" /> Guide verifie</span>
              <span className="flex items-center gap-1 text-xs text-charcoal-400"><Star size={12} className="text-bronze-500" /> Cash ou acompte</span>
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      <div className="px-4 mt-4 flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {[
          ...(guide.totalReviews >= 10 ? [{ icon: "award", label: "PONCTUEL", sub: "100%", bronze: false }] : []),
          ...(guide.avgRating >= 4.8 && guide.totalReviews >= 50 ? [{ icon: "trophy", label: "SUPER GUIDE", sub: "Top 5%", bronze: true }] : []),
          ...(guide.totalReviews > 0 ? [{ icon: "lightning", label: "REPONSE <1H", sub: "Reactif", bronze: false }] : []),
        ].map((a, i) => (
          <div key={i} className="flex-shrink-0 px-4 py-3 flex flex-col items-center gap-1 min-w-[100px] bg-white rounded-2xl" style={{ border: a.bronze ? "1.5px solid rgba(184,138,68,0.25)" : "1.5px solid rgba(17,17,17,0.08)" }}>
            <SealCheck size={20} className={a.bronze ? "text-bronze-500" : "text-charcoal-400"} weight={a.bronze ? "fill" : "regular"} />
            <span className={"text-[10px] font-bold text-center leading-tight " + (a.bronze ? "text-bronze-500" : "text-charcoal-800")}>{a.label}</span>
            <span className="text-[10px] text-charcoal-400">{a.sub}</span>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div ref={tabsRef} className="mt-5">
        <TabBar />
      </div>

      {/* CONTENT */}
      <div className="px-4 mt-5 pb-4">

        {tab === "apropos" && (
          <div className="flex flex-col gap-4">
            {guide.bio && (
              <div className="bg-white rounded-2xl px-4 py-4" style={{ borderLeft: "3px solid #B88A44" }}>
                <Quotes size={24} className="text-bronze-500/30 mb-2" />
                <p className="text-sm text-charcoal-600 leading-relaxed">{guide.bio}</p>
              </div>
            )}

            {guide.languages?.length > 0 && (
              <div className="bg-white rounded-2xl px-5 py-4" style={{ boxShadow: "0 2px 16px rgba(17,17,17,0.06)" }}>
                <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-widest mb-3">Langues parlees</h3>
                <div className="flex gap-2 flex-wrap">
                  {guide.languages.map((lang: string, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: i === 0 ? "#F5ECD8" : "rgba(17,17,17,0.06)",
                        color: i === 0 ? "#B88A44" : "#111111",
                        border: i === 0 ? "1px solid rgba(184,138,68,0.3)" : "1px solid rgba(17,17,17,0.1)"
                      }}>
                      {getLangFlag(lang)} {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal-800">Avis recents</h3>
                  <button onClick={() => setTab("avis")} className="text-xs text-bronze-500 font-medium">Voir tout</button>
                </div>
                {reviews.slice(0, 2).map((r: any) => (
                  <div key={r.id} className="bg-white rounded-2xl px-4 py-4 mb-3" style={{ boxShadow: "0 1px 8px rgba(17,17,17,0.05)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-sm font-bold text-bronze-500">{r.author?.name?.[0] || "?"}</div>
                        <div>
                          <p className="text-xs font-semibold text-charcoal-800">{r.author?.name || "Anonyme"}</p>
                          <p className="text-xs text-charcoal-400">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={11} weight={s <= (r.rating || 5) ? "fill" : "regular"} className={s <= (r.rating || 5) ? "text-amber-400" : "text-sand-300"} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-xs text-charcoal-600 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "tours" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{scrollbarWidth:"none"}}>
            {([
              {id:"popular", label:"Populaire"},
              {id:"price_asc", label:"Prix croissant"},
              {id:"price_desc", label:"Prix décroissant"},
            ] as {id:"price_asc"|"price_desc"|"popular", label:string}[]).map(s => (
              <button key={s.id} onClick={() => setSortBy(s.id)}
                className={"flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all " + (sortBy === s.id ? "bg-charcoal-800 text-white border-charcoal-800" : "bg-white text-charcoal-400 border-sand-300")}>
                {s.label}
              </button>
            ))}
          </div>

          {allItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <p className="text-sm text-charcoal-400">Aucun tour disponible</p>
              </div>
            ) : allItems.map(item => item.type === "tour"
              ? <TourCard key={item.id} guideTour={item.data} guideId={guide.id} />
              : <ExperienceCard key={item.id} experience={item.data} guideId={guide.id} />
            )}
          </div>
        )}

        {tab === "avis" && (
          <div className="flex flex-col gap-3">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <p className="text-sm text-charcoal-400">Aucun avis pour le moment</p>
              </div>
            ) : reviews.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl px-4 py-4" style={{ boxShadow: "0 1px 8px rgba(17,17,17,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-sm font-bold text-bronze-500">{r.author?.name?.[0] || "?"}</div>
                    <div>
                      <p className="text-xs font-semibold text-charcoal-800">{r.author?.name || "Anonyme"}</p>
                      <p className="text-xs text-charcoal-400">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11} weight={s <= (r.rating || 5) ? "fill" : "regular"} className={s <= (r.rating || 5) ? "text-amber-400" : "text-sand-300"} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-xs text-charcoal-600 leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "photos" && (
          <div className="grid grid-cols-3 gap-1.5">
            {guide.photos?.length > 0 ? guide.photos.map((p: any, i: number) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-sand-300">
                <img src={p.url} className="w-full h-full object-cover" />
              </div>
            )) : (
              <div className="col-span-3 bg-white rounded-2xl p-10 text-center">
                <p className="text-sm text-charcoal-400">Aucune photo disponible</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* STICKY BOTTOM BAR */}
      {tab !== "tours" && (
        <div className={"fixed bottom-0 left-0 right-0 px-4 py-3 transition-transform duration-300 z-40 " + (stickyVisible ? "translate-y-0" : "translate-y-full")}
          style={{ background: "rgba(246,241,232,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(184,138,68,0.15)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-400">A partir de</p>
              <div className="flex items-baseline gap-1.5">
                <PriceDisplay mad={price} size="lg" />
                <span className="text-xs text-charcoal-400">/ 4 pers. max</span>
              </div>
              {guide.avgRating > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={10} weight="fill" className="text-amber-400" />
                  <span className="text-xs font-semibold text-charcoal-800">{Number(guide.avgRating).toFixed(1)}</span>
                  <span className="text-xs text-charcoal-400">({guide.totalReviews})</span>
                </div>
              )}
            </div>
            <a href={"/booking/" + guide.id}
              className="flex items-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-full no-underline transition-colors"
              style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
              Reserver <ArrowRight size={14} weight="bold" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

function TourCard({ guideTour, guideId }: { guideTour: any; guideId: string }) {
  const [open, setOpen] = useState(false);
  const t = guideTour.template;
  if (!t) return null;

  const included: string[] = Array.isArray(t.included) ? t.included : [];
  const notIncluded: string[] = Array.isArray(t.notIncluded) ? t.notIncluded : [];
  const itinerary: any[] = Array.isArray(t.itinerary) ? t.itinerary : [];
  const emoji = t.tourType === "MEDINA_SECRETS" ? "🕌" : t.tourType === "GASTRONOMIE" ? "🍽️" : t.tourType === "HISTOIRE_MONUMENTS" ? "🏛️" : t.tourType === "DESERT_NATURE" ? "🏜️" : t.tourType === "SHOPPING_ARTISANAT" ? "🛍️" : t.tourType === "COUCHER_SOLEIL" ? "🌅" : "📸";

  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(17,17,17,0.06)" }}>
      <div className="relative h-52">
        {t.coverImage
          ? <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-sage-300/20 to-sand-300 flex items-center justify-center text-6xl">{emoji}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          {guideTour.isBestSeller
            ? <span className="bg-bronze-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🔥 BEST SELLER</span>
            : <span />}
          {t.transportRequired && (
            <span className="bg-white/90 backdrop-blur-sm text-charcoal-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              🚗 Transport necessaire
            </span>
          )}
          <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-sm">🤍</span>
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="font-display text-xl text-white font-bold mb-1.5">{t.title}</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[["⏱", t.duration || "4h"], ["👥", t.groupSize || "1-6"], ["🚶", t.difficulty || "Facile"]].map(([icon, val], i) => (
              <span key={i} className="text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {icon} {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {t.description && <p className="text-xs text-charcoal-400 leading-relaxed mb-3 line-clamp-2">{t.description}</p>}
        <div className="flex items-center justify-between pt-3 border-t border-sand-200 mb-3">
          <div>
            <div className="text-[10px] text-charcoal-400">A partir de</div>
            <PriceDisplay mad={priceWithCommission(Number(guideTour.price))} size="lg" />
            <div className="text-[10px] text-charcoal-400">/ / groupe · 1-4 pers. · +200 MAD/pers. suppl.</div>
          </div>
          <a href={"/booking/" + guideId + "?tourId=" + t.id + "&tourPrice=" + priceWithCommission(Number(guideTour.price)) + "&tourType=" + (t.tourType || "")}
            className="flex items-center gap-1.5 text-white font-semibold px-5 py-3 rounded-full text-sm no-underline"
            style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
            Reserver <ArrowRight size={14} weight="bold" />
          </a>
        </div>
        <button onClick={() => setOpen(!open)}
          className={"w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border-2 " + (open ? "border-sage-300 text-sage-300 bg-sage-300/5" : "border-sage-300/40 text-sage-300 hover:border-sage-300")}>
          {open ? "Masquer les details" : "Voir les details"}
          <span className={"transition-transform text-sm " + (open ? "rotate-180" : "")}>↓</span>
        </button>
      </div>

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
                  {included.map((item: string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-sage-300 text-xs font-bold flex-shrink-0">✓</span>
                      <span className="text-xs text-charcoal-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {notIncluded.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Non inclus</div>
                  {notIncluded.map((item: string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-red-400 text-xs font-bold flex-shrink-0">✗</span>
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

// ── EXPERIENCE CARD ──
function ExperienceCard({ experience: exp, guideId }: { experience: any; guideId: string }) {
  const [open, setOpen] = useState(false);
  const included: string[] = Array.isArray(exp.included) ? exp.included : [];
  const notIncluded: string[] = Array.isArray(exp.notIncluded) ? exp.notIncluded : [];
  const itinerary: any[] = Array.isArray(exp.itinerary) ? exp.itinerary : [];

  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(17,17,17,0.06)" }}>
      <div className="relative h-52">
        {exp.photos?.[0]
          ? <img src={exp.photos[0]} alt={exp.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-sage-300/20 to-sand-300 flex items-center justify-center text-6xl">🧭</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <span className="bg-bronze-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Experience</span>
          {exp.transportRequired && (
            <span className="bg-white/90 text-charcoal-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🚗 Transport</span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="font-display text-xl text-white font-bold mb-1.5">{exp.title}</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[["⏱", exp.duration || "4h"], ["👥", exp.groupSize || "1-6"], ["🚶", exp.difficulty || "Facile"]].map(([icon, val], i) => (
              <span key={i} className="text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {icon} {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {exp.description && <p className="text-xs text-charcoal-400 leading-relaxed mb-3 line-clamp-2">{exp.description}</p>}
        <div className="flex items-center justify-between pt-3 border-t border-sand-200 mb-3">
          <div>
            <div className="text-[10px] text-charcoal-400">A partir de</div>
            <PriceDisplay mad={priceWithCommission(Number(exp.price))} size="lg" />
            <div className="text-[10px] text-charcoal-400">/ / groupe · 1-4 pers. · +200 MAD/pers. suppl.</div>
          </div>
          <a href={"/booking/" + guideId + "?expId=" + exp.id + "&tourPrice=" + priceWithCommission(Number(exp.price)) + "&pricePerPerson=" + (exp.pricePerPerson !== false ? "true" : "false") + "&maxPersons=" + (exp.maxPersons || 6)}
            className="flex items-center gap-1.5 text-white font-semibold px-5 py-3 rounded-full text-sm no-underline"
            style={{ background: "linear-gradient(135deg, #B88A44, #9A7238)", boxShadow: "0 4px 14px rgba(184,138,68,0.3)" }}>
            Reserver <ArrowRight size={14} weight="bold" />
          </a>
        </div>
        <button onClick={() => setOpen(!open)}
          className={"w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border-2 " + (open ? "border-sage-300 text-sage-300 bg-sage-300/5" : "border-sage-300/40 text-sage-300 hover:border-sage-300")}>
          {open ? "Masquer les details" : "Voir les details"}
          <span className={"transition-transform text-sm " + (open ? "rotate-180" : "")}>↓</span>
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-sage-300/20 p-4 bg-sand-100 flex flex-col gap-4">
          {exp.meetingPoint && (
            <div className="flex items-start gap-2">
              <span className="text-bronze-500 text-sm">📍</span>
              <div>
                <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">Point de RDV</div>
                <div className="text-xs text-charcoal-800">{exp.meetingPoint}</div>
              </div>
            </div>
          )}
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
                  {included.map((item: string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-sage-300 text-xs font-bold flex-shrink-0">✓</span>
                      <span className="text-xs text-charcoal-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {notIncluded.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Non inclus</div>
                  {notIncluded.map((item: string) => (
                    <div key={item} className="flex items-start gap-1.5 mb-1.5">
                      <span className="text-red-400 text-xs font-bold flex-shrink-0">✗</span>
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
