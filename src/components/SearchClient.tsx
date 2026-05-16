"use client";
import { useState } from "react";
import Link from "next/link";

const CITIES_DATA = [
  { name: "Marrakech", guides: 34, img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80" },
  { name: "Fes", guides: 18, img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80" },
  { name: "Chefchaouen", guides: 12, img: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80" },
  { name: "Essaouira", guides: 9, img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80" },
  { name: "Agadir", guides: 8, img: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800&q=80" },
  { name: "Tanger", guides: 7, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80" },
  { name: "Merzouga", guides: 4, img: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80" },
  { name: "Merzouga", guides: 4, img: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80" },
];

const LANGS = ["Toutes", "Français", "Anglais", "Espagnol", "Arabe", "Hébreu", "Russe", "Allemand", "Italien"];

export default function SearchClient({ guides }: { guides: any[] }) {
  const [city, setCity] = useState("Toutes");
  const [lang, setLang] = useState("Toutes");
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filtered = guides.filter(g => {
    if (city !== "Toutes") {
      const norm = (s:string) => s?.toLowerCase().trim()
        .normalize("NFD").replace(/[̀-ͯ]/g,"");
      if (norm(g.city) !== norm(city)) return false;
    }
    if (lang !== "Toutes") {
      const normalize = (s:string) => s.toLowerCase().trim()
        .replace("english","anglais")
        .replace("french","français")
        .replace("arabic","arabe")
        .replace("spanish","espagnol")
        .replace("german","allemand")
        .replace("russian","russe")
        .replace("italian","italien")
        .replace("hebrew","hébreu");
      const hasLang = (g.languages as string[]).some((l:string) => normalize(l) === normalize(lang));
    }
    if (searchText && !g.displayName.toLowerCase().includes(searchText.toLowerCase()) && !g.city.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const hasFilters = city !== "Toutes" || lang !== "Toutes" || searchText;
  const reset = () => { setCity("Toutes"); setLang("Toutes"); setSearchText(""); };
  const CITIES = ["Toutes", ...Array.from(new Set(guides.map((g:any) => g.city).filter(Boolean).sort()))];

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg, #123EAB, #1a4fd6)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Retour</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 900, color: "#fff", fontSize: 18 }}>LAKSOR</span>
          <span style={{ color: "#F4C542", fontSize: 11, fontWeight: 700, letterSpacing: "1px" }}>MOROCCO</span>
        </div>
        <div style={{ width: 60 }}/>
      </nav>

      {/* Search Header */}
      <div style={{ background: "#fff", padding: "16px 16px 12px", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 60, zIndex: 50 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#123EAB", marginBottom: 3 }}>Trouver un guide</h1>
        <p style={{ color: "#123EAB", fontSize: 12, opacity: 0.65, marginBottom: 12 }}>{filtered.length} guides disponibles au Maroc</p>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 14 }}>🔍</span>
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Où allez-vous ?" style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: 24, padding: "10px 16px 10px 38px", fontSize: 14, fontFamily: "inherit", outline: "none", color: "#475569" }}/>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ background: "#0B132B", color: "#fff", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: "inherit" }}>
            {city !== "Toutes" ? city : "Toutes les villes"}
          </button>
          <button onClick={() => setShowFilters(!showFilters)} style={{ background: "#fff", color: "#475569", border: "1px solid #E2E8F0", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: "inherit" }}>Langues ⌄</button>
          {hasFilters && <button onClick={reset} style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: "inherit" }}>✕ Effacer</button>}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{ background: "#fff", padding: "16px", borderBottom: "1px solid #EBEBEB" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Ville</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${city === c ? "#123EAB" : "#E2E8F0"}`, background: city === c ? "#123EAB" : "#fff", color: city === c ? "#fff" : "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Langue</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${lang === l ? "#123EAB" : "#E2E8F0"}`, background: lang === l ? "#123EAB" : "#fff", color: lang === l ? "#fff" : "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowFilters(false)} style={{ width: "100%", padding: 13, borderRadius: 12, background: "#123EAB", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Voir {filtered.length} résultats
          </button>
        </div>
      )}

      <div style={{ padding: "20px 16px" }}>

        {/* Cities */}
        {city === "Toutes" && !searchText && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Villes et Destinations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CITIES_DATA.map(c => (
                <div key={c.name} onClick={() => setCity(c.name)} style={{ position: "relative", borderRadius: 16, height: 120, overflow: "hidden", cursor: "pointer" }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}/>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
                    <div>
                      <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{c.guides} guides disponibles</div>
                    </div>
                    <div style={{ width: 32, height: 32, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guides */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Guides recommandés</h2>
          <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 600 }}>Voir tout →</span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 12, marginBottom: 16 }}>{filtered.length} guides disponibles</p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Aucun guide trouvé</div>
            <button onClick={reset} style={{ color: "#123EAB", fontSize: 14, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Effacer les filtres</button>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #EBEBEB" }}>
            {filtered.map((g, i) => (
              <Link key={g.id} href={"/guide/"+g.id} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <div style={{ display: "flex", gap: 12, flex: 1 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 75, height: 75, borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg,#123EAB,#1a4fd6)" }}>
                        {g.avatar && <img src={g.avatar} alt={g.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>}
                      </div>
                      <div style={{ position: "absolute", bottom: -4, left: -4, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 6px" }}>✓</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "#0F172A", marginBottom: 2 }}>{g.displayName}</div>
                      <div style={{ color: "#F59E0B", fontSize: 12, marginBottom: 3 }}>📍 {g.city}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                        <span style={{ color: "#F59E0B", fontSize: 12 }}>★</span>
                        <span style={{ fontWeight: 600, fontSize: 12, color: "#222" }}>{Number(g.avgRating).toFixed(1)}</span>
                        <span style={{ color: "#94A3B8", fontSize: 11 }}>({g.totalReviews})</span>
                      </div>
                      <div style={{ color: "#94A3B8", fontSize: 11 }}>{(g.languages as string[]).slice(0,3).join(", ")}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0, paddingLeft: 8 }}>
                    <span style={{ fontSize: 16, color: "#CBD5E0" }}>♡</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{g.halfDayPrice} MAD</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>/ jour</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
