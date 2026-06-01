"use client";
import { useState, useMemo } from "react";

function toEur(mad: number) {
  return "€" + Math.round((mad * 1.25 + 25) * 0.092);
}

const CITIES = ["All", "Marrakech", "Fès", "Essaouira", "Chefchaouen", "Agadir"];
const LANGS  = ["All", "Français", "English", "Español", "עברית", "Русский", "Deutsch"];
const TYPES  = ["HISTOIRE","CULINAIRE","SHOPPING","MONUMENTS","AVENTURE","DESERT","NIGHTLIFE","PHOTOGRAPHIE"];
const MOOD_ICONS: Record<string, string> = {
  HISTOIRE:"🏛️", CULINAIRE:"🍽️", SHOPPING:"🛍️", MONUMENTS:"🕌",
  AVENTURE:"🧗", DESERT:"🏜️", NIGHTLIFE:"🌙", PHOTOGRAPHIE:"📸"
};
const LABELS: Record<string, string> = {
  HISTOIRE:"Culture", CULINAIRE:"Food", SHOPPING:"Shopping",
  MONUMENTS:"Monuments", AVENTURE:"Adventure", DESERT:"Desert",
  NIGHTLIFE:"Night", PHOTOGRAPHIE:"Photo"
};
const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Prix ↑" },
  { value: "price_desc", label: "Prix ↓" },
  { value: "reviews", label: "Most Reviewed" },
];

type Guide = {
  id: string; displayName: string; city: string; avatar: string | null;
  avgRating: number; totalReviews: number; halfDayPrice: number;
  languages: string[]; yearsExp: number; visitTypes: string[];
  specialties: string[];
};

function ratingLabel(r: number) {
  if (r >= 4.9) return "Exceptional";
  if (r >= 4.7) return "Excellent";
  if (r >= 4.5) return "Très bien";
  return "Bien";
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= Math.round(rating) ? "#F5A623" : "#E8DCC8" }}>★</span>
      ))}
    </span>
  );
}

export default function SearchClient({ guides }: { guides: Guide[] }) {
  const [city,     setCity]     = useState("All");
  const [lang,     setLang]     = useState("All");
  const [types,    setTypes]    = useState<string[]>([]);
  const [search,   setSearch]   = useState("");
  const [open,     setOpen]     = useState(false);
  const [sort,     setSort]     = useState("rating");
  const [maxPrice, setMaxPrice] = useState(300); // €

  const toggle = (t: string) => setTypes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  const reset  = () => { setCity("All"); setLang("All"); setTypes([]); setSearch(""); setMaxPrice(300); };
  const hasFilters = city !== "All" || lang !== "All" || types.length > 0 || search || maxPrice < 300;

  const filtered = useMemo(() => {
    let r = guides.filter(g => {
      if (city !== "All" && g.city !== city) return false;
      if (lang !== "All" && !g.languages.includes(lang)) return false;
      if (types.length > 0 && !types.some(t => g.visitTypes.includes(t))) return false;
      if (search && !g.displayName.toLowerCase().includes(search.toLowerCase()) &&
          !g.city.toLowerCase().includes(search.toLowerCase())) return false;
      const eur = Math.round((g.halfDayPrice * 1.25 + 25) * 0.092);
      if (eur > maxPrice) return false;
      return true;
    });
    if (sort === "rating")     r = [...r].sort((a,b) => b.avgRating - a.avgRating);
    if (sort === "price_asc")  r = [...r].sort((a,b) => a.halfDayPrice - b.halfDayPrice);
    if (sort === "price_desc") r = [...r].sort((a,b) => b.halfDayPrice - a.halfDayPrice);
    if (sort === "reviews")    r = [...r].sort((a,b) => b.totalReviews - a.totalReviews);
    return r;
  }, [guides, city, lang, types, search, sort, maxPrice]);

  return (
    <div style={{ background: "var(--sand)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* ── STICKY HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(246,241,232,0.95)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid var(--sand-dark)"
      }}>
        {/* Navbar */}
        <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bronze-g)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, fontFamily: "var(--font-serif)" }}>L</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 18, color: "var(--charcoal)", lineHeight: 1 }}>Laksor</div>
              <div style={{ fontSize: 7, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase" }}>Morocco</div>
            </div>
          </a>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="/search" style={{ fontSize: 12, fontWeight: 700, color: "var(--bronze)", textDecoration: "none", borderBottom: "2px solid var(--bronze)", paddingBottom: 2 }}>Guides</a>
            <a href="/transport" style={{ fontSize: 12, fontWeight: 600, color: "var(--soft)", textDecoration: "none" }}>Transport</a>
          </div>
          <a href="/auth/login" style={{ background: "var(--white)", border: "1.5px solid var(--sand-dark)", borderRadius: "999px", padding: "7px 16px", fontSize: 12, fontWeight: 700, color: "var(--charcoal)", textDecoration: "none" }}>Login</a>
        </div>

        {/* Search bar */}
        <div style={{ padding: "0 20px 10px" }}>
          <div style={{
            position: "relative", background: "var(--white)", borderRadius: "999px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1.5px solid var(--sand-dark)",
            display: "flex", alignItems: "center", padding: "0 6px 0 18px", marginBottom: 10
          }}>
            <span style={{ fontSize: 15, color: "var(--muted)", flexShrink: 0 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Guide, ville, expérience..."
              style={{ flex: 1, border: "none", outline: "none", padding: "13px 12px", fontSize: 13, fontFamily: "var(--font-body)", color: "var(--charcoal)", background: "transparent" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--sand-dark)", border: "none", color: "var(--soft)", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>✕</button>
            )}
            <div style={{ width: 1, height: 22, background: "var(--sand-dark)", margin: "0 8px" }} />
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: open ? "var(--bronze-g)" : (hasFilters ? "#FFF8ED" : "var(--sand)"),
                border: hasFilters && !open ? "1.5px solid var(--bronze)" : "none",
                borderRadius: "999px", padding: "7px 14px", fontSize: 11, fontWeight: 700,
                color: open ? "#fff" : (hasFilters ? "var(--bronze)" : "var(--charcoal)"),
                cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 5, flexShrink: 0
              }}
            >
              ⚙ Filtres
              {hasFilters && <span style={{ width: 6, height: 6, background: open ? "#fff" : "var(--bronze)", borderRadius: "50%", display: "inline-block" }} />}
            </button>
          </div>

          {/* City pills */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
            {CITIES.map(c => (
              <button
                key={c} onClick={() => setCity(c === city ? "All" : c)}
                style={{
                  padding: "6px 15px", borderRadius: "999px", border: "none",
                  background: city === c ? "var(--bronze-g)" : "var(--white)",
                  color: city === c ? "#fff" : "var(--soft)",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap", flexShrink: 0,
                  boxShadow: city === c ? "0 4px 12px rgba(184,138,68,0.35)" : "0 2px 6px rgba(0,0,0,0.05)"
                }}
              >
                {c === "All" ? "✦ Toutes" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {open && (
          <div style={{ background: "var(--white)", padding: "18px 20px 22px", borderTop: "1px solid var(--sand-dark)" }}>

            {/* Experience types */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Type d'expérience</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TYPES.map(t => (
                  <button
                    key={t} onClick={() => toggle(t)}
                    style={{
                      padding: "7px 14px", borderRadius: "999px",
                      border: `1.5px solid ${types.includes(t) ? "var(--sage)" : "var(--sand-dark)"}`,
                      background: types.includes(t) ? "#E8F0E4" : "var(--sand)",
                      color: types.includes(t) ? "var(--sage)" : "var(--soft)",
                      fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 5
                    }}
                  >
                    {MOOD_ICONS[t]} {LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Langue</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {LANGS.map(l => (
                  <button
                    key={l} onClick={() => setLang(l === lang ? "All" : l)}
                    style={{
                      padding: "7px 14px", borderRadius: "999px",
                      border: `1.5px solid ${lang === l && l !== "All" ? "var(--bronze)" : "var(--sand-dark)"}`,
                      background: lang === l && l !== "All" ? "#FFF3E0" : "var(--sand)",
                      color: lang === l && l !== "All" ? "var(--bronze)" : "var(--soft)",
                      fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)"
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Price max */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5 }}>Budget max (demi-journée)</div>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 16, color: "var(--bronze)" }}>€{maxPrice}</span>
              </div>
              <input
                type="range" min={30} max={300} step={5} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--bronze)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>€30</span>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>€300+</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={reset} style={{ flex: 1, padding: 12, border: "1.5px solid var(--sand-dark)", borderRadius: "999px", background: "var(--white)", fontSize: 12, fontWeight: 600, color: "var(--soft)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Reset
              </button>
              <button onClick={() => setOpen(false)} style={{ flex: 2, padding: 12, borderRadius: "999px", background: "var(--bronze-g)", color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Voir {filtered.length} guide{filtered.length !== 1 ? "s" : ""} →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "20px 20px 80px", maxWidth: 680, margin: "0 auto" }}>

        {/* Header + Sort */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "var(--charcoal)", marginBottom: 3, lineHeight: 1.2 }}>
              {city !== "All" ? `Guides — ${city}` : "Tous les Guides"}
            </h1>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              <strong style={{ color: "var(--charcoal)" }}>{filtered.length}</strong> expert{filtered.length !== 1 ? "s" : ""} certifié{filtered.length !== 1 ? "s" : ""} · Laksor verified
            </p>
          </div>
          {/* Sort select */}
          <div style={{ position: "relative" }}>
            <select
              value={sort} onChange={e => setSort(e.target.value)}
              style={{
                appearance: "none", WebkitAppearance: "none",
                background: "var(--white)", border: "1.5px solid var(--sand-dark)",
                borderRadius: "999px", padding: "7px 30px 7px 14px",
                fontSize: 11, fontWeight: 700, color: "var(--charcoal)",
                fontFamily: "var(--font-body)", cursor: "pointer", outline: "none"
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: "var(--muted)", pointerEvents: "none" }}>▼</span>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--white)", borderRadius: "var(--r-card)" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Aucun guide trouvé</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22 }}>Essaie d'ajuster tes filtres</div>
            <button onClick={reset} style={{ background: "var(--bronze-g)", color: "#fff", border: "none", borderRadius: "999px", padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((g, idx) => <GuideCard key={g.id} g={g} idx={idx} />)}
          </div>
        )}

        {/* Trust strip */}
        {filtered.length > 0 && (
          <div style={{ marginTop: 28, background: "var(--white)", borderRadius: 20, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, textAlign: "center" }}>Pourquoi Laksor</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "🛡️", text: "Guides certifiés & vérifiés" },
                { icon: "🔄", text: "Annulation gratuite 72h avant" },
                { icon: "💬", text: "Support WhatsApp 7j/7" },
                { icon: "🚗", text: "Transport en 1 clic" },
              ].map(t => (
                <div key={t.text} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{t.icon}</span>
                  <span style={{ fontSize: 11, color: "var(--soft)", lineHeight: 1.4 }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── GUIDE CARD ── */
function GuideCard({ g, idx }: { g: Guide; idx: number }) {
  const isTopRated = g.avgRating >= 4.8 && g.totalReviews >= 20;
  const isBestSeller = idx === 0;
  const eurPrice = Math.round((g.halfDayPrice * 1.25 + 25) * 0.092);

  return (
    <a href={`/guide/${g.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: "var(--white)", borderRadius: 28, overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid rgba(234,220,200,0.7)",
        display: "flex", transition: "transform 0.18s, box-shadow 0.18s"
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; }}
      >
        {/* Photo */}
        <div style={{ position: "relative", width: 120, flexShrink: 0 }}>
          <img
            src={g.avatar ?? `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80`}
            alt={g.displayName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 200 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,transparent 50%,rgba(0,0,0,0.1))" }} />

          {/* Badges on photo */}
          <div style={{ position: "absolute", top: 10, left: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ background: "#E8F0E4", color: "var(--sage)", fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: "999px" }}>✓ Vérifié</span>
            {isBestSeller && <span style={{ background: "var(--bronze-g)", color: "#fff", fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: "999px" }}>⭐ #1</span>}
            {isTopRated && !isBestSeller && <span style={{ background: "var(--charcoal)", color: "#fff", fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: "999px" }}>🏆 Top</span>}
          </div>

          {/* Years exp badge bottom */}
          <div style={{ position: "absolute", bottom: 10, left: 8, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", borderRadius: 8, padding: "3px 8px" }}>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>{g.yearsExp} ans exp.</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "18px 18px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* City above name — règle absolue */}
            <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
              📍 {g.city}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 700, color: "var(--charcoal)", marginBottom: 6, lineHeight: 1.15 }}>
              {g.displayName}
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <StarRow rating={g.avgRating} />
              <span style={{ fontWeight: 800, fontSize: 12, color: "var(--charcoal)" }}>{g.avgRating.toFixed(1)}</span>
              <span style={{ fontSize: 11, color: "var(--bronze)", fontWeight: 700 }}>{ratingLabel(g.avgRating)}</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>({g.totalReviews})</span>
            </div>

            {/* Specialties */}
            {g.specialties.length > 0 && (
              <div style={{ fontSize: 11, color: "var(--soft)", marginBottom: 8, lineHeight: 1.4 }}>
                {g.specialties.slice(0, 2).join(" · ")}
              </div>
            )}

            {/* Languages */}
            {g.languages.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {g.languages.slice(0, 3).map(l => (
                  <span key={l} style={{ background: "var(--sand)", border: "1px solid var(--sand-dark)", borderRadius: "999px", padding: "2px 9px", fontSize: 9, fontWeight: 700, color: "var(--soft)" }}>{l}</span>
                ))}
              </div>
            )}

            {/* Visit type moods */}
            {g.visitTypes.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {g.visitTypes.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 10, color: "var(--muted)" }}>
                    {MOOD_ICONS[t] ?? "✦"}
                  </span>
                ))}
                {g.visitTypes.length > 3 && <span style={{ fontSize: 10, color: "var(--muted)" }}>+{g.visitTypes.length - 3}</span>}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--sand)" }}>
            <div>
              <div style={{ fontSize: 8, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 1 }}>À partir de</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--charcoal)", lineHeight: 1 }}>
                €{eurPrice}
              </div>
              <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>/ pers · 4h privé</div>
            </div>
            <a
              href={`/booking?guide=${g.id}`}
              onClick={e => e.stopPropagation()}
              style={{
                background: "var(--bronze-g)", color: "#fff", borderRadius: "999px",
                padding: "11px 20px", fontSize: 12, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 4px 14px rgba(184,138,68,0.35)",
                flexShrink: 0
              }}
            >
              Réserver →
            </a>
          </div>
        </div>
      </div>
    </a>
  );
}
