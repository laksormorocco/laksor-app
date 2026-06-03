"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";
import {
  ArrowLeft, Heart, ShareNetwork, MapPin, Star,
  Clock, ChatCircle, Shield, Translate, Camera,
  CheckCircle, ThumbsUp
} from "@phosphor-icons/react";

function toEur(mad: number): string {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const LANG_FLAGS: Record<string, string> = {
  "Français": "🇫🇷", "Anglais": "🇬🇧", "Espagnol": "🇪🇸",
  "Allemand": "🇩🇪", "Italien": "🇮🇹", "Arabe": "🇲🇦",
};

export default function GuidePageClient({ guide }: { guide: any }) {
  const [tab,   setTab]   = useState("apropos");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch("/api/guide/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId: guide.id })
    });
  }, [guide.id]);

  return (
    <div className="bg-sand-200 min-h-screen pb-40">

      {/* ── COVER ── */}
      <div className="relative h-64">
        <img
          src={guide.avatar ?? "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"}
          alt={guide.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link href="/search"
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <ArrowLeft size={16} color="#fff" weight="bold" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
            >
              <Heart size={16} color="#fff" weight={liked ? "fill" : "regular"} className={liked ? "text-red-400" : ""} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <ShareNetwork size={16} color="#fff" weight="bold" />
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={13} color="rgba(255,255,255,0.7)" weight="fill" />
            <span className="text-white/70 text-xs font-medium">{guide.city}</span>
          </div>
          <div className="font-display text-2xl font-semibold text-white mb-2 leading-tight">
            {guide.displayName}
          </div>
          <div className="flex items-center gap-3">
            {guide.avgRating > 0 && (
              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star size={11} color="#F4C542" weight="fill" />
                <span className="text-white text-xs font-bold">{Number(guide.avgRating).toFixed(1)}</span>
                <span className="text-white/60 text-xs">({guide.totalReviews})</span>
              </div>
            )}
            {guide.yearsExp > 0 && (
              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Clock size={11} color="rgba(255,255,255,0.8)" />
                <span className="text-white text-xs font-medium">{guide.yearsExp} ans d'exp.</span>
              </div>
            )}
            <span className="bg-sage-300/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ml-auto">
              ✓ Certifié
            </span>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-charcoal-800 grid grid-cols-4 text-center py-3 px-2">
        {[
          { val: Number(guide.avgRating).toFixed(1), label: "Note",      cls: "text-bronze-500" },
          { val: guide.totalReviews,                  label: "Avis",      cls: "text-white" },
          { val: guide.yearsExp || "—",               label: "Ans exp.",  cls: "text-white" },
          { val: (guide.visitTypes as string[]).length || "5", label: "Circuits", cls: "text-white" },
        ].map((s, i) => (
          <div key={s.label} className={`${i < 3 ? "border-r border-white/10" : ""} px-1`}>
            <div className={`font-display text-base font-bold ${s.cls}`}>{s.val}</div>
            <div className="text-[9px] text-white/35 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── BADGES ── */}
      <div className="bg-white border-b border-sand-300 flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-2 bg-sage-50 border border-sage-300 rounded-xl px-3 py-2 flex-shrink-0">
          <span className="text-base">⏰</span>
          <div>
            <div className="text-[10px] font-bold text-sage-300">100% PONCTUEL</div>
            <div className="text-[9px] text-charcoal-400">{guide.totalReviews} visites</div>
          </div>
        </div>
        {Number(guide.avgRating) >= 4.8 && (
          <div className="flex items-center gap-2 bg-bronze-50 border border-bronze-500 rounded-xl px-3 py-2 flex-shrink-0">
            <span className="text-base">🏆</span>
            <div>
              <div className="text-[10px] font-bold text-bronze-500">SUPER GUIDE</div>
              <div className="text-[9px] text-charcoal-400">Top 5%</div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 bg-sand-200 border border-sand-300 rounded-xl px-3 py-2 flex-shrink-0">
          <span className="text-base">⚡</span>
          <div className="text-[10px] font-bold text-charcoal-700">RÉPONSE &lt;1H</div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300 flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          ["apropos",  "À propos"],
          ["services", "Services"],
          ["avis",     `Avis (${guide.totalReviews})`],
          ["photos",   "Photos"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-3.5 text-xs font-bold flex-shrink-0 border-b-2 transition-colors
              ${tab === id
                ? "text-bronze-500 border-bronze-500"
                : "text-charcoal-400 border-transparent"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: À PROPOS ── */}
      {tab === "apropos" && (
        <div className="px-4 pt-4 flex flex-col gap-3">

          {/* Bio */}
          <div className="bg-white rounded-2xl p-4 border border-sand-300">
            <p className="text-sm text-charcoal-500 leading-relaxed italic mb-4 pb-4 border-b border-sand-200">
              &ldquo;{guide.bio}&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sand-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-charcoal-400 text-[10px] font-bold uppercase tracking-wide mb-1">
                  <MapPin size={10} className="text-bronze-500" weight="fill" /> Ville
                </div>
                <div className="text-sm font-semibold text-charcoal-800">{guide.city}</div>
              </div>
              <div className="bg-sand-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-charcoal-400 text-[10px] font-bold uppercase tracking-wide mb-1">
                  <CheckCircle size={10} className="text-sage-300" weight="fill" /> Transport
                </div>
                <div className="text-sm font-semibold text-sage-300">Disponible</div>
              </div>
            </div>
          </div>

          {/* Langues */}
          <div className="bg-white rounded-2xl p-4 border border-sand-300">
            <div className="flex items-center gap-2 mb-3">
              <Translate size={16} className="text-bronze-500" weight="duotone" />
              <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">Langues</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(guide.languages as string[]).map((l: string) => (
                <span key={l}
                  className="flex items-center gap-1.5 bg-bronze-50 border border-bronze-500 text-bronze-500 text-xs font-bold px-3 py-1.5 rounded-full">
                  <span>{LANG_FLAGS[l] ?? "🏳️"}</span> {l}
                </span>
              ))}
            </div>
          </div>

          {/* Spécialités */}
          {(guide.specialties as string[]).length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-sand-300">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-bronze-500" weight="duotone" />
                <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">Spécialités</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(guide.specialties as string[]).map((s: string) => (
                  <span key={s} className="bg-sand-200 border border-sand-300 text-charcoal-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setTab("services")}
            className="w-full py-4 bg-bronze-500 hover:bg-bronze-600 text-white font-bold text-sm rounded-2xl transition-colors"
          >
            Voir les services · à partir de {guide.halfDayPrice} MAD
          </button>
        </div>
      )}

      {/* ── TAB: SERVICES ── */}
      {tab === "services" && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {[
            { title: "Demi-journée (4h)",     desc: "Découverte de la médina, souks et monuments principaux", price: guide.halfDayPrice, popular: true },
            { title: "Journée complète (8h)", desc: "Exploration complète de la ville et des environs",        price: guide.fullDayPrice, popular: false },
            { title: "Tour culinaire",        desc: "Dégustation et cours de cuisine marocaine authentique",   price: 400,               popular: false },
            { title: "Excursion désert",      desc: "Journée dans le désert avec chameau et coucher de soleil",price: 800,               popular: false },
          ].map(s => (
            <div key={s.title}
              className={`bg-white rounded-2xl p-4 border flex items-center justify-between gap-3 transition-all
                ${s.popular ? "border-bronze-500" : "border-sand-300"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-charcoal-800">{s.title}</span>
                  {s.popular && (
                    <span className="bg-sage-50 text-sage-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sage-300">
                      Populaire
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-400 leading-relaxed">{s.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-display text-lg font-bold text-charcoal-800">{s.price} MAD</div>
                <div className="text-[10px] text-charcoal-400">{toEur(Number(s.price))}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: AVIS ── */}
      {tab === "avis" && (
        <div className="px-4 pt-4 flex flex-col gap-3">

          {/* Résumé notes */}
          <div className="bg-white rounded-2xl p-4 border border-sand-300">
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
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-charcoal-500">{r.label}</span>
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
              <ThumbsUp size={14} weight="fill" />
              <span className="text-xs font-bold">97% recommandent {guide.displayName.split(" ")[0]}</span>
            </div>
          </div>

          {/* Liste avis */}
          {guide.reviews?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
              <ChatCircle size={32} className="text-charcoal-300 mx-auto mb-3" weight="duotone" />
              <div className="text-sm text-charcoal-400">Aucun avis pour le moment</div>
            </div>
          ) : (
            guide.reviews?.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border border-sand-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-sand-300 overflow-hidden flex items-center justify-center font-bold text-charcoal-600 flex-shrink-0">
                    {r.author?.avatar
                      ? <img src={r.author.avatar} className="w-full h-full object-cover" />
                      : r.author?.name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-charcoal-800">{r.author?.name || "Voyageur"}</div>
                    <div className="text-[10px] text-charcoal-400">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div className="text-bronze-500 text-sm">{"★".repeat(r.rating)}</div>
                </div>
                <p className="text-sm text-charcoal-500 leading-relaxed italic">&ldquo;{r.comment}&rdquo;</p>
                <div className="flex items-center gap-1 mt-2">
                  <ThumbsUp size={11} className="text-sage-300" weight="fill" />
                  <span className="text-[11px] font-bold text-sage-300">Recommandé</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── TAB: PHOTOS ── */}
      {tab === "photos" && (
        <div className="px-4 pt-4">
          {(guide.gallery as string[]).length === 0 && !guide.avatar ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-sand-300">
              <Camera size={32} className="text-charcoal-300 mx-auto mb-3" weight="duotone" />
              <div className="text-sm text-charcoal-400">Aucune photo disponible</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {guide.avatar && (
                <img src={guide.avatar} alt="" className="w-full h-36 object-cover rounded-2xl" />
              )}
              {(guide.gallery as string[]).map((img: string, i: number) => (
                <img key={i} src={img} alt="" className="w-full h-36 object-cover rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STICKY FOOTER ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-lg border-t border-sand-300 px-4 pt-3 pb-6 z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-center flex-1">
            <div className="font-display text-lg font-bold text-charcoal-800">
              {guide.halfDayPrice} <span className="text-sm font-normal text-charcoal-400">MAD</span>
            </div>
            <div className="text-[10px] text-charcoal-400">4h · Demi-journée</div>
          </div>
          <div className="w-px h-8 bg-sand-300" />
          <div className="text-center flex-1">
            <div className="font-display text-lg font-bold text-charcoal-800">
              {guide.fullDayPrice} <span className="text-sm font-normal text-charcoal-400">MAD</span>
            </div>
            <div className="text-[10px] text-charcoal-400">8h · Journée</div>
          </div>
        </div>
        <BookingModal
          guideName={guide.displayName}
          halfDayPrice={Number(guide.halfDayPrice)}
          fullDayPrice={Number(guide.fullDayPrice)}
          guideId={guide.id}
        />
      </div>
    </div>
  );
}
