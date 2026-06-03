"use client";
import { useState, useMemo } from "react";
import { MagnifyingGlass, MapPin, Star, Clock, SlidersHorizontal, X, ArrowLeft } from "@phosphor-icons/react";

function toEur(mad: number) {
  return Math.round((mad * 1.25 + 25) * 0.092);
}

const CITIES = ["All", "Marrakech", "Fès", "Essaouira", "Chefchaouen", "Agadir"];
const LANGS  = ["All", "Français", "Anglais", "Espagnol", "Allemand", "Italien", "Arabe"];

const LANG_FLAGS: Record<string, string> = {
  "Français": "🇫🇷", "Anglais": "🇬🇧", "Espagnol": "🇪🇸",
  "Allemand": "🇩🇪", "Italien": "🇮🇹", "Arabe": "🇲🇦",
};

const TYPES = ["HISTOIRE","CULINAIRE","SHOPPING","MONUMENTS","AVENTURE","DESERT","NIGHTLIFE","PHOTOGRAPHIE"];
const MOOD_ICONS: Record<string, string> = {
  HISTOIRE:"🏛️", CULINAIRE:"🍽️", SHOPPING:"🛍️", MONUMENTS:"🕌",
  AVENTURE:"🧗", DESERT:"🏜️", NIGHTLIFE:"🌙", PHOTOGRAPHIE:"📸"
};
const LABELS: Record<string, string> = {
  HISTOIRE:"Culture", CULINAIRE:"Food", SHOPPING:"Shopping",
  MONUMENTS:"Monuments", AVENTURE:"Aventure", DESERT:"Désert",
  NIGHTLIFE:"Nuit", PHOTOGRAPHIE:"Photo"
};
const SORT_OPTIONS = [
  { value: "rating",     label: "Mieux notés"   },
  { value: "price_asc",  label: "Prix ↑"        },
  { value: "price_desc", label: "Prix ↓"        },
  { value: "reviews",    label: "Plus d'avis"   },
];

type Guide = {
  id: string; displayName: string; city: string; avatar: string | null;
  avgRating: number; totalReviews: number; halfDayPrice: number;
  languages: string[]; yearsExp: number; visitTypes: string[];
  specialties: string[];
};

function ratingLabel(r: number) {
  if (r >= 4.9) return "Exceptionnel";
  if (r >= 4.7) return "Excellent";
  if (r >= 4.5) return "Très bien";
  if (r > 0)    return "Bien";
  return "";
}

// ── GUIDE CARD ──
// Fix hydration: pas de <a> imbriqué — on utilise un div cliquable pour la card
// et un vrai <a> seulement pour le bouton Réserver
function GuideCard({ g, idx }: { g: Guide; idx: number }) {
  const isTop      = g.avgRating >= 4.8 && g.totalReviews >= 20;
  const isBest     = idx === 0;
  const eurPrice   = toEur(g.halfDayPrice);
  const label      = ratingLabel(g.avgRating);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-sand-300 flex cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => window.location.href = `/guide/${g.id}`}
    >
      {/* Photo */}
      <div className="relative w-28 flex-shrink-0">
        <img
          src={g.avatar ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"}
          alt={g.displayName}
          className="w-full h-full object-cover"
          style={{ minHeight: 180 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-white/90 text-sage-300 text-[9px] font-bold px-2 py-0.5 rounded-full">✓ Certifié</span>
          {isBest && <span className="bg-bronze-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">⭐ #1</span>}
          {isTop && !isBest && <span className="bg-charcoal-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">🏆 Top</span>}
        </div>

        {/* Expérience */}
        {g.yearsExp > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/55 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
            <Clock size={9} color="#fff" />
            <span className="text-white text-[9px] font-bold">{g.yearsExp} ans</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 p-4 flex flex-col min-w-0">
        <div className="flex-1">
          {/* Ville */}
          <div className="flex items-center gap-1 text-charcoal-400 text-[10px] font-bold uppercase tracking-wide mb-1">
            <MapPin size={10} weight="fill" className="text-bronze-500" />
            {g.city}
          </div>

          {/* Nom */}
          <div className="font-display text-base font-semibold text-charcoal-800 mb-1 leading-tight">
            {g.displayName}
          </div>

          {/* Note */}
          {g.avgRating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={11} weight={i <= Math.round(g.avgRating) ? "fill" : "regular"}
                    className={i <= Math.round(g.avgRating) ? "text-bronze-500" : "text-sand-300"} />
                ))}
              </div>
              <span className="text-xs font-bold text-charcoal-800">{g.avgRating.toFixed(1)}</span>
              {label && <span className="text-xs font-bold text-bronze-500">{label}</span>}
              <span className="text-[11px] text-charcoal-400">({g.totalReviews})</span>
            </div>
          )}

          {/* Spécialités */}
          {g.specialties.length > 0 && (
            <div className="text-xs text-charcoal-400 mb-2 line-clamp-1">
              {g.specialties.slice(0, 2).join(" · ")}
            </div>
          )}

          {/* Langues */}
          {g.languages.length > 0 && (
            <div className="flex gap-0.5 mb-2">
              {g.languages.slice(0, 4).map(l => (
                <span key={l} className="text-sm leading-none" title={l}>
                  {LANG_FLAGS[l] ?? "🏳️"}
                </span>
              ))}
            </div>
          )}

          {/* Types */}
          {g.visitTypes.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {g.visitTypes.slice(0, 3).map(t => (
                <span key={t} className="text-sm">{MOOD_ICONS[t] ?? "✦"}</span>
              ))}
              {g.visitTypes.length > 3 && (
                <span className="text-[10px] text-charcoal-400">+{g.visitTypes.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Prix + CTA */}
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-sand-200">
          <div>
            <div className="text-[9px] text-charcoal-400 uppercase tracking-wide">À partir de</div>
            <div className="font-display text-xl font-bold text-charcoal-800 leading-none">€{eurPrice}</div>
            <div className="text-[9px] text-charcoal-400 mt-0.5">/ 2 pers. · 4h</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); window.location.href = `/guide/${g.id}`; }}
            className="bg-sage-300 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-sage-400 transition-colors flex-shrink-0 ml-2"
          >
            Voir le profil →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchClient({ guides }: { guides: Guide[] }) {
  const [city,     setCity]     = useState("All");
  const [lang,     setLang]     = useState("All");
  const [types,    setTypes]    = useState<string[]>([]);
  const [search,   setSearch]   = useState("");
  const [open,     setOpen]     = useState(false);
  const [sort,     setSort]     = useState("rating");
  const [maxPrice, setMaxPrice] = useState(300);

  const toggle  = (t: string) => setTypes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  const reset   = () => { setCity("All"); setLang("All"); setTypes([]); setSearch(""); setMaxPrice(300); };
  const hasFilters = city !== "All" || lang !== "All" || types.length > 0 || !!search || maxPrice < 300;

  const filtered = useMemo(() => {
    let r = guides.filter(g => {
      if (city !== "All" && g.city !== city) return false;
      if (lang !== "All" && !g.languages.includes(lang)) return false;
      if (types.length > 0 && !types.some(t => g.visitTypes.includes(t))) return false;
      if (search && !g.displayName.toLowerCase().includes(search.toLowerCase()) && !g.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (toEur(g.halfDayPrice) > maxPrice) return false;
      return true;
    });
    if (sort === "rating")     r = [...r].sort((a,b) => b.avgRating - a.avgRating);
    if (sort === "price_asc")  r = [...r].sort((a,b) => a.halfDayPrice - b.halfDayPrice);
    if (sort === "price_desc") r = [...r].sort((a,b) => b.halfDayPrice - a.halfDayPrice);
    if (sort === "reviews")    r = [...r].sort((a,b) => b.totalReviews - a.totalReviews);
    return r;
  }, [guides, city, lang, types, search, sort, maxPrice]);

  return (
    <div className="bg-sand-200 min-h-screen pb-20">

      {/* ── HEADER STICKY ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-sand-300">

        {/* Navbar */}
        <div className="flex items-center gap-3 px-4 h-14">
          <a href="/" className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-700 flex-shrink-0">
            <ArrowLeft size={16} weight="bold" />
          </a>
          <div className="flex-1 flex items-center gap-2 bg-white border border-sand-300 rounded-full px-3 py-2 shadow-sm">
            <MagnifyingGlass size={14} className="text-charcoal-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Guide, ville, expérience..."
              className="flex-1 bg-transparent text-sm text-charcoal-800 outline-none placeholder-charcoal-400 min-w-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className="w-5 h-5 rounded-full bg-sand-300 flex items-center justify-center flex-shrink-0">
                <X size={10} className="text-charcoal-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
              ${hasFilters ? "bg-bronze-500 border-bronze-500 text-white" : "border-sand-300 text-charcoal-600"}`}
          >
            <SlidersHorizontal size={16} weight="bold" />
          </button>
        </div>

        {/* City pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCity(c === city ? "All" : c)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all
                ${city === c
                  ? "bg-bronze-500 text-white shadow-sm"
                  : "bg-white text-charcoal-500 border border-sand-300"}`}
            >
              {c === "All" ? "✦ Toutes" : c}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILTRES PANEL ── */}
      {open && (
        <div className="bg-white border-b border-sand-300 px-4 py-4">

          {/* Types */}
          <div className="mb-4">
            <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">Type d&apos;expérience</div>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${types.includes(t)
                      ? "border-sage-300 bg-sage-50 text-sage-300"
                      : "border-sand-300 text-charcoal-500"}`}
                >
                  {MOOD_ICONS[t]} {LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Langues */}
          <div className="mb-4">
            <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-2">Langue</div>
            <div className="flex gap-2 flex-wrap">
              {LANGS.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l === lang ? "All" : l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                    ${lang === l && l !== "All"
                      ? "border-bronze-500 bg-bronze-50 text-bronze-500"
                      : "border-sand-300 text-charcoal-500"}`}
                >
                  {l !== "All" && LANG_FLAGS[l]} {l === "All" ? "Toutes" : l}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Budget max</div>
              <span className="font-display text-sm font-bold text-bronze-500">€{maxPrice}</span>
            </div>
            <input
              type="range" min={30} max={300} step={5} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-bronze-500 cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-charcoal-400">€30</span>
              <span className="text-[10px] text-charcoal-400">€300+</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 border border-sand-300 rounded-full text-sm font-semibold text-charcoal-500"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-[2] py-3 bg-bronze-500 text-white rounded-full text-sm font-bold"
            >
              Voir {filtered.length} guide{filtered.length !== 1 ? "s" : ""} →
            </button>
          </div>
        </div>
      )}

      {/* ── RÉSULTATS ── */}
      <div className="px-4 pt-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-charcoal-800">
              {city !== "All" ? `Guides · ${city}` : "Tous les Guides"}
            </h1>
            <p className="text-xs text-charcoal-400 mt-0.5">
              <strong className="text-charcoal-800">{filtered.length}</strong> guide{filtered.length !== 1 ? "s" : ""} certifié{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-sand-300 rounded-full px-3 py-1.5 text-xs font-bold text-charcoal-700 bg-white outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-display text-lg font-semibold text-charcoal-800 mb-2">Aucun guide trouvé</div>
            <div className="text-sm text-charcoal-400 mb-5">Essaie d&apos;ajuster tes filtres</div>
            <button
              onClick={reset}
              className="bg-bronze-500 text-white px-6 py-3 rounded-full text-sm font-bold"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((g, idx) => <GuideCard key={g.id} g={g} idx={idx} />)}
          </div>
        )}

        {/* Pourquoi Laksor */}
        {filtered.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl p-4 border border-sand-200">
            <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-3 text-center">
              Pourquoi Laksor
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🛡️", text: "Guides certifiés & vérifiés" },
                { icon: "🔄", text: "Annulation gratuite 72h avant" },
                { icon: "💬", text: "Support WhatsApp 7j/7" },
                { icon: "🚗", text: "Transport en 1 clic" },
              ].map(t => (
                <div key={t.text} className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">{t.icon}</span>
                  <span className="text-xs text-charcoal-400 leading-relaxed">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
